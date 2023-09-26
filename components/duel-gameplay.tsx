import { useWrite } from '@/hooks/useWrite';
import {
  findLastNonEmptyTile,
  getNextRow,
  getRowWord,
  makeEmptyGrid,
  decryptWord,
  decryptWords,
} from '@/lib/wordle';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useCallback } from 'react';
import Keyboard, { isMappableKey } from './wordle/keyboard';
import { toast } from './ui/use-toast';
import Grid from './wordle/grid';
import { flatten } from 'ramda';
import { words } from '@/lib/wordle';
import { useSubscribe } from '@/hooks/useSubscribe';
import va from '@vercel/analytics';

export const DuelGamePlay = ({ duel, yourTurn }) => {
  const emptyGrid = makeEmptyGrid();
  const [grid, setGrid] = useState(emptyGrid);
  const [cursor, setCursor] = useState({ y: 0, x: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState('');
  const [isGameSet, setIsGameSet] = useState(false);
  const contract = useWrite();

  const setGame = useCallback(
    async (targetWord, duelWords) => {
      const secret = await decryptWord(targetWord);
      const words = await decryptWords(duelWords);
      const newGrid = emptyGrid;

      // function to count letters in a string
      function countLetters(str, letter) {
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
      setIsLoading(false);
      setIsGameSet(true);
    },
    [emptyGrid]
  );

  useSubscribe({
    eventName: 'DuelMove',
    listener(logs: any) {
      const words = logs[0]?.args?.words;
      const moveCount = logs[0]?.args?.moveCount;
      setGame(duel.targetWord, words);
      setIsLoading(false);
      const title = !yourTurn ? 'Your Turn' : `Opponent's Turn`;
      const movesRemaining = 6 - parseInt(moveCount);
      return toast({
        title,
        description: `${movesRemaining} ${
          movesRemaining === 1 ? 'move' : 'moves'
        } remaining.`,
      });
    },
  });

  useEffect(() => {
    if (!isGameSet) setGame(duel.targetWord, duel.words);
  }, [duel.targetWord, duel.words, isGameSet, setGame]);

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
    if (!yourTurn) return;
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

  async function encryptWord(guessWord) {
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
      return { status: 'playing' };
    }

    const guessWord = getRowWord(grid[cursor.y]);

    if (guessWord.length !== 5) {
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
    const attempts = cursor.y + 1;
    const isLastRow = cursor.y === grid.length - 1;
    const newGrid = grid;

    newGrid[cursor.y] = getNextRow(newGrid[cursor.y], secret);

    setGrid([...newGrid]);

    if (!isLastRow) {
      const newCursor = {
        y: cursor.y + 1,
        x: 0,
      };
      setCursor(newCursor);
    }

    if (won) {
      toast({
        title: 'You Win',
        description: `${Number(duel.potAmount) / 10 ** 18} ETH is yours!`,
      });
      va.track('DuelWin', {
        ...duel,
      });
    } else {
      if (isLastRow) {
        toast({
          title: 'Game Over',
          description: `Pot is split between players. The word was "${secret}".`,
          variant: 'destructive',
        });
        va.track('DuelLoss', {
          ...duel,
        });
      } else {
        toast({
          title: 'Incorrect',
          description: 'Updating the board ...',
        });
      }
    }

    let word = await encryptWord(guessWord);

    if (won) word = duel.targetWord;

    await contract?.makeMove(duel.id.toString(), word, {
      value: duel.moveAmount,
    });

    va.track('DuelMove', {
      ...duel,
    });

    return {
      status: !isLastRow && !won ? 'playing' : won ? 'win' : 'loss',
      guess: guessWord,
      attempts,
    };
  }

  const usedKeys: any = [];
  const allKeys = flatten(grid);
  for (const i in allKeys) {
    const tile: any = allKeys[i];
    if (tile.children !== '' && tile.variant !== 'empty') usedKeys.push(tile);
  }

  return (
    <>
      <Badge variant="secondary">{Number(duel.potAmount) / 10 ** 18} ETH</Badge>
      <div className="fixed bottom-5">
        <Badge>{yourTurn ? 'Your Turn' : `Opponent's Turn`}</Badge>
      </div>
      <div className="flex flex-col gap-6 py-4 w-full px-3 max-w-lg">
        <Grid data={grid} />
        <Keyboard
          usedKeys={usedKeys}
          disabled={isLoading || !yourTurn || duel.state === 2}
          onKeyPress={handleKeyPress}
        />
      </div>
    </>
  );
};
