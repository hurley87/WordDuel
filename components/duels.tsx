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
    <div className="mx-auto w-full max-w-md ">
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="fixed top-11 left-0 right-0 mx-auto max-w-md rounded-none">
          <TabsTrigger className="w-full" value="practice">
            Practice for Free
          </TabsTrigger>
          <TabsTrigger className="w-full" value="ranked">
            Duel for ETH
          </TabsTrigger>
        </TabsList>
        <TabsContent className="max-w-md mx-auto" value="practice">
          <Link
            href="/practice"
            className="fixed bottom-9 left-0 right-0 mx-auto max-w-md"
          >
            <Button className="w-full rounded-none">
              Create Practice Duel
            </Button>
          </Link>
          <Tabs defaultValue="All Practices" className="w-full pt-2">
            <TabsList className="fixed bottom-0 left-0 right-0 max-w-md mx-auto rounded-none">
              <TabsTrigger className="w-full" value="All Practices">
                All Practice Duels
              </TabsTrigger>
              <TabsTrigger className="w-full" value="My Practices">
                My Practice Duels
              </TabsTrigger>
            </TabsList>
            <TabsContent value="All Practices">
              <div className="flex flex-col gap-0 pt-14 pb-32 h-screen overflow-auto w-full">
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
                  <Icons.egg className="mx-auto h-14 w-14 mt-32" />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="ranked">
          <Link
            href="/duel"
            className="fixed bottom-9 left-0 right-0  mx-auto max-w-md"
          >
            <Button className="w-full rounded-none">Create Ranked Duel</Button>
          </Link>
          <Tabs defaultValue="All Duels" className="w-full pt-2">
            <TabsList className="fixed bottom-0 right-0 left-0 max-w-md mx-auto rounded-none">
              <TabsTrigger className="w-full" value="All Duels">
                All Ranked Duels
              </TabsTrigger>
              <TabsTrigger className="w-full" value="My Duels">
                My Ranked Duels
              </TabsTrigger>
            </TabsList>
            <TabsContent value="All Duels">
              <div className="flex flex-col gap-2 pt-14 pb-32 h-screen overflow-auto max-w-md mx-auto">
                {duels
                  ?.reverse()
                  .map((duel: any) => (
                    <DuelFree key={parseInt(duel.id)} duelId={duel.id} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="My Duels">
              {myduels?.length > 0 ? (
                <div className="flex flex-col gap-2 pt-14 pb-32 h-screen overflow-auto max-w-md mx-auto">
                  {myduels
                    ?.reverse()
                    .map((duelId) => (
                      <DuelFree key={parseInt(duelId)} duelId={duelId} />
                    ))}
                </div>
              ) : (
                <Icons.egg className="mx-auto h-14 w-14 mt-32" />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Duels;
