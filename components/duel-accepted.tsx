import { useWrite } from '@/hooks/useWrite';
import { UserContext } from '@/lib/UserContext';
import {
  findLastNonEmptyTile,
  getNextRow,
  getRowWord,
  makeEmptyGrid,
} from '@/lib/wordle';
import { Badge } from '@/components/ui/badge';
import { useContext, useEffect, useState } from 'react';
import Keyboard, { isMappableKey } from './wordle/keyboard';
import { toast } from './ui/use-toast';
import Grid from './wordle/grid';
import { flatten } from 'ramda';
import { words } from '@/lib/wordle';

export const DuelAccepted = ({ duel }) => {
  const [user, _]: any = useContext(UserContext);
  const yourTurn =
    duel?.currentPlayer.toLowerCase() === user?.publicAddress.toLowerCase();
  const emptyGrid = makeEmptyGrid();
  const [grid, setGrid] = useState(emptyGrid);
  const [cursor, setCursor] = useState({ y: 0, x: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState('');
  const { writeAsync: makeMove } = useWrite({
    functionName: 'makeMove',
  });

  async function decryptWord(ciphertext) {
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

  // This function decrypts an array of words
  async function decryptWords(words) {
    const wordArr = words.split(',');
    wordArr.shift();
    console.log(wordArr);
    for (let i = 0; i < wordArr.length; i++) {
      wordArr[i] = await decryptWord(wordArr[i]);
    }
    return wordArr;
  }

  useEffect(() => {
    async function loadGame() {
      setIsLoading(true);
      const secret = await decryptWord(duel.targetWord);
      console.log(secret);
      const words = await decryptWords(duel.words);
      for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[i].length; j++) {
          console.log(words[i][j]);
          insert(words[i][j]);
          // pause for 1 second
          // await new Promise((r) => setTimeout(r, 1000));
        }
      }
      console.log(words);

      setSecret(secret);
      setIsLoading(false);
    }
    loadGame();
  }, [duel.targetWord]);

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
      console.log(newCursor);
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
    if (cursor.x !== grid[0].length - 1) {
      return { status: 'playing' };
    }

    console.log(grid);

    const guessWord = getRowWord(grid[cursor.y]);

    if (guessWord.length !== 5) {
      return {
        status: 'playing',
      };
    }

    console.log(guessWord);

    try {
      const result = words.includes(guessWord);
      if (!result) {
        toast({
          title: `"${guessWord}" is not a word.`,
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
        description: 'Now claim your prize.',
      });
      // TODO: handle win
    } else {
      if (isLastRow) {
        toast({
          title: 'You lost.',
          description: 'Please try again.',
          variant: 'destructive',
        });
        // TODO: handle loss
      }
    }

    const word = await encryptWord(guessWord);

    await makeMove?.({
      args: [duel.id.toString(), word],
      value: duel.moveAmount,
    });

    return {
      status: !isLastRow && !won ? 'playing' : won ? 'win' : 'loss',
      guess: guessWord,
      attempts,
    };
  }

  console.log(grid);

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
        <Badge>{yourTurn ? 'Your turn' : `Opponent's turn`}</Badge>
      </div>
      <div className="flex flex-col gap-6 py-4">
        <Grid data={grid} />
        <Keyboard
          usedKeys={usedKeys}
          disabled={isLoading || !yourTurn}
          onKeyPress={handleKeyPress}
        />
      </div>
    </>
  );
};
