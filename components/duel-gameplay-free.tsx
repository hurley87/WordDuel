import {
  findLastNonEmptyTile,
  getNextRow,
  getRowWord,
  makeEmptyGrid,
  decryptWord,
  decryptWords,
} from '@/lib/wordle';
import { useEffect, useState, useCallback } from 'react';
import Keyboard, { isMappableKey } from './wordle/keyboard';
import { toast } from './ui/use-toast';
import Grid from './wordle/grid';
import { flatten } from 'ramda';
import { words } from '@/lib/wordle';
import { useFreeSubscribe } from '@/hooks/useFreeSubscribe';
import { makeMove } from '@/lib/gelato';
import va from '@vercel/analytics';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useWallets } from '@privy-io/react-auth';
import { formatAddress } from '@/lib/utils';
import { baseGoerli, base } from 'wagmi/chains';

type Props = {
  duel: any;
  yourTurn: boolean;
};

export const DuelGamePlayFree = ({ duel, yourTurn }: Props) => {
  const emptyGrid = makeEmptyGrid();
  const [grid, setGrid] = useState(emptyGrid);
  const [cursor, setCursor] = useState({ y: 0, x: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState('');
  const [isGameSet, setIsGameSet] = useState(false);
  const { wallet } = usePrivyWagmi();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );
  const address = wallet?.address as `0x${string}`;

  const setGame = useCallback(
    async (targetWord: any, duelWords: any) => {
      const secret = await decryptWord(targetWord);
      const words = await decryptWords(duelWords);
      const newGrid = emptyGrid;

      // function to count letters in a string
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
      setIsLoading(false);
      setIsGameSet(true);
    },
    [emptyGrid]
  );

  useFreeSubscribe({
    eventName: 'DuelMove',
    listener(logs: any) {
      const words = logs[0]?.args?.words;
      setGame(duel.targetWord, words);
      setIsLoading(false);
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
        description: `All the glory is yours!`,
      });
      va.track('PracticeWin', {
        address,
      });
    } else {
      if (isLastRow) {
        toast({
          title: 'Game Over',
          description: `The word was "${secret}".`,
          variant: 'destructive',
        });
        va.track('PracticeLoss', {
          address,
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
    const chainId =
      process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;

    let provider = await wallets[0]?.getEthersProvider();
    wallets[0]?.switchChain(chainId);
    if (embeddedWallet) provider = await embeddedWallet?.getEthersProvider();

    await makeMove(provider, duel.id.toString(), word);

    va.track('PracticeMove', {
      address,
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
    <div className="flex flex-col gap-8 py-4 w-full px-2 ">
      <Grid data={grid} />
      <Keyboard
        usedKeys={usedKeys}
        disabled={isLoading || !yourTurn || duel.state === 2}
        onKeyPress={handleKeyPress}
      />
      <div className="flex flex-row gap-2 text-sm justify-center font-medium leading-none text-center">
        <p
          className={duel.currentPlayer === duel.challenger ? '' : 'opacity-50'}
        >
          {formatAddress(duel.challenger)}
        </p>
        <p>⚔️</p>
        <p className={duel.currentPlayer === duel.opponent ? '' : 'opacity-50'}>
          {formatAddress(duel.opponent)}
        </p>
      </div>
    </div>
  );
};
