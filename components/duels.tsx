'use client';

import '@/styles/globals.css';
import { useRead } from '@/hooks/useRead';
import FAQ from './faq';
import { Duel } from './duel';
import { Container } from './container';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

function Duels() {
  const { wallet } = usePrivyWagmi();
  const { data: duels } = useRead({
    functionName: 'getMyDuels',
    watch: true,
    args: [wallet?.address],
  });

  console.log(wallet);
  const { data: createdDuels } = useRead({
    functionName: 'getCreatedDuels',
    args: [],
  });
  const noDuels = !duels?.length;

  console.log(duels);
  console.log(createdDuels);

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[330px]">
      <Container>
        <div className="flex flex-col gap-2 w-full">
          <Link href="/duel" className="w-full">
            <Button className="w-full">Duel for ETH</Button>
          </Link>
          <Link href="/practice" className="w-full">
            <Button variant="outline" className="w-full">
              Practice for Free
            </Button>
          </Link>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-2">
          {duels
            ?.reverse()
            .map((duelId: any) => (
              <Duel key={parseInt(duelId)} duelId={duelId} />
            ))}
        </div>
      </Container>

      {noDuels && (
        <Container>
          <FAQ />
        </Container>
      )}
    </div>
  );
}

export default Duels;
