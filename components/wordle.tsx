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

  function convertNumberToWord(number: number) {
    switch (number) {
      case 0:
        return 'first';
      case 1:
        return 'second';
      case 2:
        return 'third';
      case 3:
        return 'fourth';
      case 4:
        return 'fifth';
    }
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

  function convertNewGridToPrompt(newGrid: any) {
    let prompt = '';
    for (let i = 0; i < newGrid.length; i++) {
      const row = newGrid[i];
      let word = '';
      for (let j = 0; j < row.length; j++) {
        const tile = row[j];
        if (tile.variant === 'correct') {
          prompt += `The ${convertNumberToWord(j)} letter is ${
            tile.children
          }.\n`;
        }
        if (tile.variant === 'absent') {
          prompt += `${tile.children} is not in the word.\n`;
        }
        if (tile.variant === 'present') {
          prompt += `${
            tile.children
          } is in the word but not the ${convertNumberToWord(j)} letter.\n`;
        }
        if (tile.children !== '') {
          word += tile.children;
        }
      }
      if (word !== '') prompt += `${word} is not the word\n`;
    }
    prompt += '\nReturn just one word.\n';
    return prompt;
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
        description: 'Now challenge your friend to a duel.',
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

      const prompt = convertNewGridToPrompt(newGrid);

      const answerResponse = await fetch('/api/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!answerResponse.ok) {
        console.log('ERRROR');
      }

      const data = answerResponse.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let word = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        word += chunkValue.toLowerCase();
      }

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
      } else {
        if (isLastRow) {
          toast({
            title: 'Game is a tie',
            description: 'Please try again.',
            variant: 'destructive',
          });
          resetGame();
        }
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

  return (
    <main className="m-auto flex max-w-lg flex-1 flex-col gap-4 justify-between px-1 py-4 md:py-0">
      <Grid data={grid} />
      <Keyboard
        usedKeys={usedKeys}
        disabled={isLoading}
        onKeyPress={handleKeyPress}
      />
    </main>
  );
}
