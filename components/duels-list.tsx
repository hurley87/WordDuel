'use client';

import '@/styles/globals.css';
import { Duel } from './duel';

function DuelsList({ duelslist, route }) {
  return (
    <div className="flex flex-col gap-0">
      {duelslist
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
