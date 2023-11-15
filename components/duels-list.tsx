'use client';

import '@/styles/globals.css';
import { Duel } from './duel';

type Props = {
  duelslist: any;
  route: string;
};

function DuelsList({ duelslist, route }: Props) {
  return (
    <div className="flex flex-col gap-0">
      {duelslist
        .map((duel: any) => {
          duel.id = parseInt(duel.id.toString());
          return duel;
        })
        .sort((a: { id: number }, b: { id: number }) => b.id - a.id)
        .map((duel: any) => (
          <Duel key={parseInt(duel.id)} route={route} duel={duel} />
        ))}
    </div>
  );
}

export default DuelsList;
