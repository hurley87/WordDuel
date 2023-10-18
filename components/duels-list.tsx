'use client';

import '@/styles/globals.css';
import { Duel } from './duel';
import { useEffect, useState } from 'react';
// import { Button } from './ui/button';
import { getTwitterUsername } from '@/lib/utils';

function DuelsList({ duelslist, route }) {
  const [duels, setDuels] = useState([]);
  // const [duelType, setDuelType] = useState('Open');

  useEffect(() => {
    duelslist.map(async (duel) => {
      const challengerTwitter = await getTwitterUsername(duel.challenger);
      if (challengerTwitter) duel.challengerTwitter = challengerTwitter;

      if (duel.opponent !== '0x0000000000000000000000000000000000000000') {
        const opponentTwitter = await getTwitterUsername(duel.opponent);
        if (opponentTwitter) duel.opponentTwitter = opponentTwitter;
      }

      return duel;
    });
    setDuels(duelslist);
  }, [duelslist]);

  return (
    <div className="flex flex-col gap-0">
      {/* <div className="border-b border-accent flex gap-2 w-full items-center justify-center pb-2 px-2">
        <Button
          onClick={() => setDuelType('Open')}
          size="sm"
          className="w-full"
          variant={'Open' === duelType ? 'default' : 'outline'}
        >
          Open
        </Button>
        <Button
          onClick={() => setDuelType('Active')}
          size="sm"
          className="w-full"
          variant={'Active' === duelType ? 'default' : 'outline'}
        >
          Active
        </Button>
        <Button
          onClick={() => setDuelType('Over')}
          size="sm"
          className="w-full"
          variant={'Over' === duelType ? 'default' : 'outline'}
        >
          Over
        </Button>
      </div> */}
      {/* {duelType === 'Open' &&
        duels
          ?.filter((duel: any) => duel.state === 0)
          .reverse()
          .map((duel: any) => (
            <Duel key={parseInt(duel.id)} route={route} duel={duel} />
          ))}
      {duelType === 'Active' &&
        duels
          ?.filter((duel: any) => duel.state === 1)
          .reverse()
          .map((duel: any) => (
            <Duel key={parseInt(duel.id)} route={route} duel={duel} />
          ))}
      {duelType === 'Over' &&
        duels
          ?.filter((duel: any) => duel.state === 2)
          .reverse()
          .map((duel: any) => (
            <Duel key={parseInt(duel.id)} route={route} duel={duel} />
          ))} */}
      {duels
        // ?.filter((duel: any) => duel.state === 0)
        .map((duel: any) => {
          duel.id = parseInt(duel.id.toString());
          return duel;
        })
        .sort(({ id: a }, { id: b }) => b - a)
        .map((duel: any) => (
          <Duel key={parseInt(duel.id)} route={route} duel={duel} />
        ))}
    </div>
  );
}

export default DuelsList;
