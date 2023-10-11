'use client';

import '@/styles/globals.css';
import { useRead } from '@/hooks/useRead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFreeRead } from '@/hooks/useFreeRead';
import { DuelFree } from './duel-free';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { Icons } from './icons';
import { PracticeDuelCreate } from './practice-duel-create';
import { DuelCreate } from './duel-create';
import { Duel } from './duel';

function Duels() {
  const { wallet } = usePrivyWagmi();
  const { data: duels } = useRead({
    functionName: 'getCreatedDuels',
    args: [],
  });
  const { data: myduels } = useRead({
    functionName: 'getMyDuels',
    args: [wallet?.address],
  });
  const { data: myfreeduels } = useFreeRead({
    functionName: 'getMyDuels',
    args: [wallet?.address],
  });
  const { data: freeduels } = useFreeRead({
    functionName: 'getDuels',
    args: [],
  });

  console.log(duels);

  return (
    <div className="mx-auto w-full max-w-md shadow-inner md:shadow-accent">
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="fixed top-11 left-0 right-0 mx-auto max-w-md rounded-none">
          <TabsTrigger className="w-full" value="practice">
            Practice for Free
          </TabsTrigger>
          <TabsTrigger className="w-full" value="ranked">
            Play for ETH
          </TabsTrigger>
        </TabsList>
        <TabsContent className="max-w-md mx-auto" value="practice">
          <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full">
            <PracticeDuelCreate />
          </div>
          <div className="flex flex-col gap-0 pt-24 md:pt-20 pb-32 h-screen overflow-auto">
            <div className="flex flex-col gap-0">
              {myfreeduels
                ?.reverse()
                .map((duelId) => (
                  <DuelFree key={parseInt(duelId)} duelId={duelId} />
                ))}
              {freeduels
                ?.filter((duel: any) => !myfreeduels?.includes(duel.id))
                ?.reverse()
                .map((duel: any) => (
                  <DuelFree key={parseInt(duel.id)} duelId={duel.id} />
                ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="ranked">
          <div className="fixed bottom-0 left-0 right-0  mx-auto max-w-md w-full">
            <DuelCreate />
          </div>
          <div className="flex flex-col gap-0 pt-24 md:pt-20 pb-32 h-screen overflow-auto max-w-md mx-auto">
            {myduels
              ?.reverse()
              .map((duelId) => <Duel key={parseInt(duelId)} duelId={duelId} />)}
            {duels
              ?.filter((duel: any) => !myduels?.includes(duel.id))
              ?.reverse()
              .map((duel: any) => (
                <Duel key={parseInt(duel.id)} duelId={duel.id} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Duels;
