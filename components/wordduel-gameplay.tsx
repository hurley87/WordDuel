import {
  findLastNonEmptyTile,
  getRowWord,
  makeEmptyGrid,
  decryptWord,
  decryptWords,
  convertGridToPrompt,
  chatGPTGuess,
} from '@/lib/wordle';
import { useEffect, useState, useCallback } from 'react';
import Keyboard, { isMappableKey } from './wordle/keyboard';
import { toast } from './ui/use-toast';
import Grid from './wordle/grid';
import { flatten } from 'ramda';
import { words } from '@/lib/wordle';
import va from '@vercel/analytics';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { updateDuel } from '@/lib/db';
import { Button } from './ui/button';
import { Icons } from './icons';
import { useAIWrite } from '@/hooks/useAIWrite';
import Link from 'next/link';

type Props = {
  duel: any;
};

const WordDuelGamePlay = ({ duel }: Props) => {
  const emptyGrid = makeEmptyGrid();
  const [isLoading, setIsLoading] = useState(false);
  const [grid, setGrid] = useState(emptyGrid);
  const [cursor, setCursor] = useState({ y: 0, x: 0 });
  const [secret, setSecret] = useState('');
  const [isGameSet, setIsGameSet] = useState(false);
  const [isGameOver, setIsGameOver] = useState(duel?.is_over);
  const [isWinner, setIsWinner] = useState(duel?.is_winner);
  const [isRewardClaimed, setIsRewardClaimed] = useState(duel?.has_claimed);
  const [duelWords, setDuelWords] = useState(duel?.words);
  const [isClaiming, setIsClaiming] = useState(false);
  const { write: finishDuel } = useAIWrite('finishDuel');
  const { wallet } = usePrivyWagmi();
  const address = wallet?.address as `0x${string}`;

  const setGame = useCallback(
    async (targetWord: string, duelWords: any) => {
      const secret = await decryptWord(targetWord);
      const words = await decryptWords(duelWords);
      const newGrid = emptyGrid;

      function countLetters(str: string, letter: string) {
        let letterCount = 0;
        for (let position = 0; position < str.length; position++) {
          if (str.charAt(position) == letter) {
            letterCount += 1;
          }
        }
        return letterCount;
      }

      for (let i = 0; i < words.length; i++) {
        let word = '';
        for (let j = 0; j < words[i].length; j++) {
          const children = words[i][j];
          word += words[i][j];
          let variant = 'absent' as 'present' | 'empty' | 'correct' | 'absent';
          if (
            secret.includes(children) &&
            countLetters(secret, children) >= countLetters(word, children)
          ) {
            variant = 'present';
          }
          if (secret[j] === children) variant = 'correct';

          newGrid[i][j] = {
            cursor: { y: i, x: j },
            children: words[i][j],
            variant,
          };
        }
      }

      setGrid(newGrid);
      setCursor({ y: words.length, x: 0 });
      setSecret(secret);
      setIsGameSet(true);
    },
    [emptyGrid]
  );

  useEffect(() => {
    if (!isGameSet) setGame(duel.secret_word, duelWords);
  }, [duel.secret_word, duelWords, isGameSet, setGame]);

  function insert(key: string) {
    const newGrid = grid;
    const row = grid[cursor.y];
    const tile = row[cursor.x];
    const isLastColumn = cursor.x === row.length - 1;

    newGrid[cursor.y][cursor.x] = {
      ...tile,
      children: key,
    };
    setGrid([...newGrid]);

    if (!isLastColumn) {
      const newCursor = {
        y: cursor.y,
        x: cursor.x + 1,
      };
      setCursor(newCursor);
    }
  }

  function deleteGuess() {
    const newGrid = grid;
    const lastNonEmptyTile = findLastNonEmptyTile(grid[cursor.y]);

    if (!lastNonEmptyTile) {
      return;
    }

    const newCursor = lastNonEmptyTile.cursor;
    setCursor(newCursor);
    const { y, x } = newCursor;
    const target = newGrid[y][x];

    target['children'] = '';
    target['variant'] = 'empty';

    setGrid([...newGrid]);
  }

  async function handleKeyPress(key: string) {
    if (!isMappableKey(key)) {
      insert(key);
      return;
    }
    switch (key) {
      case 'backspace':
        deleteGuess();
        break;
      case 'enter':
        await guess();
        break;
    }
  }

  async function encryptWord(guessWord: string) {
    const res = await fetch('/api/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guessWord,
      }),
    });
    const data = await res.json();
    return data.ciphertext;
  }

  async function guess() {
    setIsLoading(true);
    if (cursor.x !== grid[0].length - 1) {
      setIsLoading(false);
      return { status: 'playing' };
    }

    const guessWord = getRowWord(grid[cursor.y]);
    console.log('guessWord', guessWord);

    if (guessWord.length !== 5) {
      setIsLoading(false);
      return {
        status: 'playing',
      };
    }

    try {
      const result = words.includes(guessWord);
      if (!result) {
        toast({
          title: `"${guessWord}" is not a word.`,
          description: 'Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return {
          status: 'playing',
        };
      }
    } catch {}

    const won = secret === guessWord;

    if (won) {
      const newDuel = {
        ...duel,
        words: duelWords + ',' + (await encryptWord(guessWord)),
        is_over: true,
        is_winner: true,
      };
      await updateDuel(newDuel);
      setIsLoading(false);
      setIsGameOver(true);
      setIsWinner(true);
      toast({
        title: 'You won!',
        description: `You guessed the word "${guessWord}"`,
      });
      return;
    }

    const prompt = convertGridToPrompt(grid);

    const aiWord = (await chatGPTGuess(prompt)) as string;
    let encryptedAiWord = await encryptWord(aiWord);

    const aiWon = secret === aiWord;
    let encryptedWord = await encryptWord(guessWord);

    if (aiWon) {
      const newDuel = {
        ...duel,
        is_over: true,
        is_winner: false,
      };
      await updateDuel(newDuel);
      setIsLoading(false);
      setIsGameOver(true);

      toast({
        title: 'You lost!',
        description: `The AI guessed the word "${aiWord}"`,
      });
      return;
    }

    try {
      const updatedDuelWords =
        duelWords + ',' + encryptedWord + ',' + encryptedAiWord;
      setDuelWords(updatedDuelWords);

      const newDuel = {
        ...duel,
        words: updatedDuelWords,
      };
      console.log('newDuel', newDuel);
      await updateDuel(newDuel);

      setGame(duel.secret_word, updatedDuelWords);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }

    va.track('DuelMove', {
      address,
    });
  }

  async function handleClaimReward() {
    setIsClaiming(true);
    try {
      await finishDuel({
        args: [duel.game_id.toString()],
      });
      setIsClaiming(false);
      setIsRewardClaimed(true);
      toast({
        title: 'Reward claimed!',
        description: 'You can now play again.',
      });
    } catch (error) {
      console.log(error);
      setIsClaiming(false);
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  }

  const usedKeys: any = [];
  const allKeys = flatten(grid);
  for (const i in allKeys) {
    const tile: any = allKeys[i];
    if (tile.children !== '' && tile.variant !== 'empty') usedKeys.push(tile);
  }

  return (
    <>
      {isGameOver && !isWinner && !isRewardClaimed && (
        <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
          <Icons.wallet className="h-8 w-8 mx-auto" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">You Lost</h2>
            <p className="text-sm">You can always try again.</p>
          </div>
          <Link href="/">
            <Button size="lg">Back</Button>
          </Link>
        </div>
      )}
      {isGameOver && isWinner && !isRewardClaimed && (
        <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
          <Icons.wallet className="h-8 w-8 mx-auto" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">You Won $XP</h2>
            <p className="text-sm">Claim your reward of 2 $XP and continue.</p>
          </div>
          <Button disabled={isClaiming} onClick={handleClaimReward} size="lg">
            {isClaiming ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.wallet className="mr-2 h-4 w-4" />
            )}
            Claim Your Reward
          </Button>
        </div>
      )}

      {isGameOver && isRewardClaimed && (
        <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
          <Icons.wallet className="h-8 w-8 mx-auto" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">Reward Claimed</h2>
            <p className="text-sm">Continue to the next level.</p>
          </div>
          <Link href="/">
            <Button size="lg">Continue</Button>
          </Link>
        </div>
      )}
      {!isGameOver && (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto text-center mt-24">
          <Grid data={grid} />
          <Keyboard
            usedKeys={usedKeys}
            disabled={isLoading}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}
    </>
  );
};

export default WordDuelGamePlay;
