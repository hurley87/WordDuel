import { decryptWord, decryptWords, makeEmptyGrid } from '@/lib/wordle';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import Grid from './wordle/grid';
import { Button } from './ui/button';
import Link from 'next/link';

export const DuelFinished = ({ duel, yourTurn }) => {
  const emptyGrid = makeEmptyGrid();
  const [grid, setGrid] = useState(emptyGrid);
  const [isGameSet, setIsGameSet] = useState(false);
  const [winnerExists, setWinnerExists] = useState(false);

  const setGame = useCallback(
    async (targetWord, duelWords) => {
      const secret = await decryptWord(targetWord);
      const words = await decryptWords(duelWords);
      const lastWord = words[words.length - 1];
      const newGrid = emptyGrid;

      for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[i].length; j++) {
          const children = words[i][j];
          let variant = 'absent' as 'present' | 'empty' | 'correct' | 'absent';
          if (secret.includes(children)) variant = 'present';
          if (secret[j] === children) variant = 'correct';

          newGrid[i][j] = {
            cursor: { y: i, x: j },
            children: words[i][j],
            variant,
          };
        }
      }

      setGrid(newGrid);
      setIsGameSet(true);
      setWinnerExists(secret === lastWord);
    },
    [emptyGrid]
  );

  useEffect(() => {
    if (!isGameSet) setGame(duel.targetWord, duel.words);
  }, [duel.targetWord, duel.words, isGameSet, setGame]);

  let message = `${yourTurn ? 'You' : 'Your opponent'} won ${
    Number(duel.potAmount) / 10 ** 18
  } ETH`;
  if (!winnerExists)
    message = `${Number(duel.potAmount) / 10 ** 18} ETH pot split`;

  return (
    <>
      <Badge variant="secondary">{message}</Badge>
      <div className="flex flex-col gap-4 py-4">
        <Grid data={grid} />
      </div>
    </>
  );
};
