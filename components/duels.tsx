'use client';

import '@/styles/globals.css';
import { useRead } from '@/hooks/useRead';
import { Button } from './ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFreeRead } from '@/hooks/useFreeRead';
import { DuelFree } from './duel-free';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { Icons } from './icons';

function Duels() {
  const { wallet } = usePrivyWagmi();
  const { data: duels } = useRead({
    functionName: 'getDuels',
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

  return (
    <div className="mx-auto w-full max-w-sm">
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="absolute bottom-1 left-2 right-2 mx-auto max-w-sm">
          <TabsTrigger className="w-full" value="practice">
            Practice
          </TabsTrigger>
          <TabsTrigger className="w-full" value="ranked">
            Ranked
          </TabsTrigger>
        </TabsList>
        <TabsContent className="max-w-sm mx-auto" value="practice">
          <Link
            href="/practice"
            className="absolute bottom-11 left-2 right-2  mx-auto max-w-sm"
          >
            <Button className="w-full">Create Practice Duel</Button>
          </Link>
          <Tabs defaultValue="All Practices" className="w-full pt-2">
            <TabsList className="absolute top-12 left-2 right-2 max-w-sm mx-auto">
              <TabsTrigger className="w-full" value="All Practices">
                All Practice Duels
              </TabsTrigger>
              <TabsTrigger className="w-full" value="My Practices">
                My Practice Duels
              </TabsTrigger>
            </TabsList>
            <TabsContent value="All Practices">
              <div className="flex flex-col gap-2 pt-14 pb-32 h-screen overflow-auto">
                {freeduels
                  ?.reverse()
                  .map((duel: any) => (
                    <DuelFree key={parseInt(duel.id)} duelId={duel.id} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="My Practices">
              <div className="flex flex-col gap-2 pt-14 pb-32 h-screen overflow-auto">
                {myfreeduels?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {myfreeduels
                      ?.reverse()
                      .map((duelId) => (
                        <DuelFree key={parseInt(duelId)} duelId={duelId} />
                      ))}
                  </div>
                ) : (
                  <Icons.egg className="mx-auto h-14 w-14 mt-10" />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="ranked">
          <Link
            href="/duel"
            className="absolute bottom-11 left-2 right-2  mx-auto max-w-sm"
          >
            <Button className="w-full">Duel for ETH</Button>
          </Link>
          <Tabs defaultValue="All Duels" className="w-full pt-2">
            <TabsList className="absolute top-12 right-2 left-2 max-w-sm mx-auto">
              <TabsTrigger className="w-full" value="All Duels">
                All Ranked Duels
              </TabsTrigger>
              <TabsTrigger className="w-full" value="My Duels">
                My Ranked Duels
              </TabsTrigger>
            </TabsList>
            <TabsContent value="All Duels">
              <div className="flex flex-col gap-2 pt-14 pb-32 h-screen overflow-auto">
                {duels
                  ?.reverse()
                  .map((duel: any) => (
                    <DuelFree key={parseInt(duel.id)} duelId={duel.id} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="My Duels">
              {myduels?.length > 0 ? (
                <div className="flex flex-col gap-2 pt-14 pb-32 h-screen overflow-auto">
                  {myduels
                    ?.reverse()
                    .map((duelId) => (
                      <DuelFree key={parseInt(duelId)} duelId={duelId} />
                    ))}
                </div>
              ) : (
                <Icons.egg className="mx-auto h-14 w-14 mt-10" />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Duels;
