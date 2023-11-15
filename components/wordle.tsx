import { useEffect, useState } from 'react';
import Grid from '@/components/wordle/grid';
import Keyboard, { isMappableKey } from '@/components/wordle/keyboard';
import {
  makeEmptyGrid,
  getRowWord,
  getNextRow,
  findLastNonEmptyTile,
  convertGridToPrompt,
  getSecretWord,
  chatGPTGuess,
  words,
} from '@/lib/wordle';
import { flatten } from 'ramda';
import { toast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import va from '@vercel/analytics';

export default function Wordle() {
  const { wallet } = usePrivyWagmi();
  const address = wallet?.address as `0x${string}`;
  const emptyGrid = makeEmptyGrid();
  const [grid, setGrid] = useState(emptyGrid);
  const [cursor, setCursor] = useState({ y: 0, x: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function loadGame() {
      setIsLoading(true);
      const secret = await getSecretWord();
      setSecret(secret);
      setIsLoading(false);
    }
    loadGame();
  }, []);

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

  async function guess() {
    setIsLoading(true);
    va.track('Guess', {
      address,
    });
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
      if (!words.includes(guessWord)) {
        toast({
          title: 'Invalid guess.',
          description: 'Please try again.',
          variant: 'destructive',
        });
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
        title: 'Congratulations!',
        description: `${secret} is the correct word.`,
      });
      va.track('HumanWins', {
        address,
      });
      setGameOver(true);
    } else {
      if (isLastRow) {
        toast({
          title: 'You lost.',
          description: 'Please try again.',
          variant: 'destructive',
        });
        va.track('ChatGPTWins', {
          address,
        });
        setGameOver(true);
      }

      const prompt = convertGridToPrompt(newGrid);

      const word = (await chatGPTGuess(prompt)) as string;

      for (let j = 0; j < word.length; j++) {
        const letter = word[j];

        let variant = 'absent' as 'present' | 'empty' | 'correct' | 'absent';
        if (secret.includes(letter)) {
          variant = 'present';
        }
        if (secret[j] === letter) variant = 'correct';
        newGrid[attempts][j] = {
          cursor: { y: attempts, x: j },
          children: word[j],
          variant,
        };
      }

      setGrid([...newGrid]);
      if (!isLastRow) {
        const newCursor = {
          y: cursor.y + 2,
          x: 0,
        };
        setCursor(newCursor);
      }

      const won = secret === word;

      if (won) {
        toast({
          title: 'You lost.',
          description: 'Please try again.',
          variant: 'destructive',
        });
        va.track('ChatGPTWins', {
          address,
        });
        setGameOver(true);
      } else {
        if (attempts === 5) {
          toast({
            title: 'Game is a tie',
            description: `The word was ${secret}.`,
            variant: 'destructive',
          });
          va.track('TieGame', {
            address,
          });
          setGameOver(true);
        }
      }
    }

    setIsLoading(false);

    return {
      status: !isLastRow && !won ? 'playing' : won ? 'win' : 'loss',
      guess: guessWord,
      attempts,
    };
  }

  async function resetGame() {
    const emptyGrid = makeEmptyGrid();
    setGrid(emptyGrid);
    setCursor({ y: 0, x: 0 });
    const secret = await getSecretWord();
    setSecret(secret);
    setIsLoading(false);
    setGameOver(false);
    va.track('ResetGame', {
      address,
    });
  }

  const usedKeys: any = [];
  const allKeys = flatten(grid);
  for (const i in allKeys) {
    const tile: any = allKeys[i];
    if (tile.children !== '' && tile.variant !== 'empty') usedKeys.push(tile);
  }

  return (
    <main className="m-auto flex max-w-lg flex-1 flex-col gap-4 justify-between px-1 py-4 md:py-0">
      {gameOver && (
        <Button className="max-w-xs mx-auto" onClick={resetGame}>
          Play again
        </Button>
      )}

      <Grid data={grid} />
      <Keyboard
        usedKeys={usedKeys}
        disabled={isLoading}
        onKeyPress={handleKeyPress}
      />
    </main>
  );
}
