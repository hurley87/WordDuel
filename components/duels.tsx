'use client';

import '@/styles/globals.css';
import { useRead } from '@/hooks/useRead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFreeRead } from '@/hooks/useFreeRead';
import { PracticeDuelCreate } from './practice-duel-create';
import { DuelCreate } from './duel-create';
import DuelsList from './duels-list';

function Duels() {
  const { data: duels } = useRead({
    functionName: 'getDuels',
    args: [],
  });
  const { data: freeduels } = useFreeRead({
    functionName: 'getDuels',
    args: [],
  });

  return (
    <div className="w-full">
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="w-full rounded-none">
          <TabsTrigger className="w-full" value="practice">
            Practice for Free
          </TabsTrigger>
          <TabsTrigger className="w-full" value="ranked">
            Play for ETH
          </TabsTrigger>
        </TabsList>
        <TabsContent value="practice">
          <div className="mx-auto max-w-md w-full fixed bottom-20 md:bottom-14">
            <PracticeDuelCreate />
          </div>
          <div className="flex flex-col gap-0 h-screen overflow-auto">
            {freeduels?.length > 0 && (
              <DuelsList duelslist={freeduels} route="practice" />
            )}
          </div>
        </TabsContent>
        <TabsContent value="ranked">
          <div className="mx-auto max-w-md w-full fixed bottom-20 md:bottom-14">
            <DuelCreate />
          </div>
          <div className="h-screen overflow-auto max-w-md mx-auto">
            {duels?.length > 0 && <DuelsList duelslist={duels} route="duel" />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Duels;
