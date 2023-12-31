import { decryptWord, decryptWords, makeEmptyGrid } from '@/lib/wordle';
import { useCallback, useEffect, useState } from 'react';
import Grid from './wordle/grid';
import { Button } from './ui/button';
import Link from 'next/link';
import { formatAddress } from '@/lib/utils';
import Loading from './loading';

type Duel = {
  id: string;
  targetWord: string;
  words: string[][];
  currentPlayer: string;
};

type Props = {
  duel: Duel;
  yourTurn: boolean;
};

export const DuelFinishedFree = ({ duel, yourTurn }: Props) => {
  const emptyGrid = makeEmptyGrid();
  const [grid, setGrid] = useState(emptyGrid);
  const [isGameSet, setIsGameSet] = useState(false);
  const [winnerExists, setWinnerExists] = useState(false);
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(true);

  const setGame = useCallback(
    async (targetWord: any, duelWords: any) => {
      const secret = await decryptWord(targetWord);
      const words = await decryptWords(duelWords);
      const lastWord = words[words.length - 1];
      setSecret(secret);
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
      setLoading(false);
    },
    [emptyGrid]
  );

  useEffect(() => {
    if (!isGameSet) setGame(duel.targetWord, duel.words);
  }, [duel.targetWord, duel.words, isGameSet, setGame]);

  let message = `${
    yourTurn ? 'You' : `${formatAddress(duel.currentPlayer)}`
  } won`;
  if (!winnerExists) message = `Ended in a tie`;

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-2 text-center pt-10">
      <h1 className="font-black uppercase">{secret}</h1>
      <p className="font-light pb-2">{message}</p>
      <div className="flex flex-col gap-4">
        <Grid data={grid} />
        <Link href="/">
          <Button className="w-full" variant="ghost">
            Play Again
          </Button>
        </Link>
      </div>
    </div>
  );
};
