'use client';

import HowToPlay from '@/components/how-to-play';
import { Icons } from '@/components/icons';
import { usePrivy } from '@privy-io/react-auth';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAIWrite } from '@/hooks/useAIWrite';
import { generateWord } from '@/lib/wordle';
import { useAISubscribe } from '@/hooks/useAISubscribe';
import { createDuel } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useContractWrite } from 'wagmi';

export default function CreateDuelPage({}: any) {
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const { ready } = usePrivy();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const config = useAIWrite('createDuel', []);
  const { write } = useContractWrite(config);
  const router = useRouter();

  async function insertDuel(id: string) {
    const secret_word = await generateWord();
    const duel = {
      game_id: parseInt(id),
      secret_word,
      address,
    };
    const { data: game } = await createDuel(duel).select();
    const gameId = game?.[0]?.id;
    router.push(`/game/${gameId}`);
    setIsCreating(false);
  }

  useAISubscribe({
    eventName: 'DuelCreated',
    listener(logs: any) {
      const player = logs[0]?.args?.player;
      if (player !== address) return;
      insertDuel(logs[0]?.args?.id);
    },
  });

  async function handleCreateDuel() {
    setIsCreating(true);
    write?.();
  }

  if (!ready) return <Loading />;

  return (
    <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-4 text-center">
      <Icons.swords className="h-8 w-8 mx-auto" />
      <div className="flex flex-col gap-2">
        <p className="text-xl font-black">Start Level</p>
        <p className="text-sm">
          If you win, you'll earn 2 $XP and get to the next level. The higher
          the level the smarter the AI. Good luck!
        </p>
      </div>
      <Button onClick={handleCreateDuel} size="lg">
        {isCreating ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.swords className="mr-2 h-4 w-4" />
        )}
        Start
      </Button>
      <HowToPlay>
        <Button variant="outline" size="lg">
          <Icons.help className="mr-2 h-4 w-4" />
          How to Play
        </Button>
      </HowToPlay>
    </div>
  );
}
