import { useEffect, useState } from 'react';
import Grid from '@/components/wordle/grid';
import Keyboard, { isMappableKey } from '@/components/wordle/keyboard';
import {
  makeEmptyGrid,
  getRowWord,
  getNextRow,
  findLastNonEmptyTile,
} from '@/lib/wordle';
import { flatten } from 'ramda';
import { toast } from '@/components/ui/use-toast';

export default function Wordle() {
  const emptyGrid = makeEmptyGrid();
  const [grid, setGrid] = useState(emptyGrid);
  const [cursor, setCursor] = useState({ y: 0, x: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState('');

  useEffect(() => {
    async function loadGame() {
      setIsLoading(true);
      const secret = await getSecretWord();
      setSecret(secret);
      setIsLoading(false);
    }
    loadGame();
  }, []);

  async function getSecretWord() {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const { ciphertext } = await res.json();
    const result = await fetch('/api/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ciphertext,
      }),
    });
    const { decryptedText } = await result.json();
    return decryptedText;
  }

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
      const result = { valid: true };
      if (!result.valid) {
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
        title: 'You won!',
        description: 'Now challenge your friend to a word duel.',
      });
    } else {
      if (isLastRow) {
        toast({
          title: 'You lost.',
          description: 'Please try again.',
          variant: 'destructive',
        });
        resetGame();
      }
    }

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
  }

  const usedKeys: any = [];
  const allKeys = flatten(grid);
  for (const i in allKeys) {
    const tile: any = allKeys[i];
    if (tile.children !== '' && tile.variant !== 'empty') usedKeys.push(tile);
  }

  console.log(secret);

  return (
    <main className="m-auto flex max-w-lg flex-1 flex-col justify-between px-1 py-4 md:py-0">
      <Grid data={grid} />
      <Keyboard
        usedKeys={usedKeys}
        disabled={isLoading}
        onKeyPress={handleKeyPress}
      />
    </main>
  );
}
