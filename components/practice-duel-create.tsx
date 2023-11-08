'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useFreeSubscribe } from '@/hooks/useFreeSubscribe';
import { generateWord } from '@/lib/wordle';
import { createDuel } from '@/lib/gelato';
import va from '@vercel/analytics';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { baseGoerli, base } from 'wagmi/chains';
import GetStarted from './get-started';

export function PracticeDuelCreate() {
  const { user } = usePrivy();
  const { wallet } = usePrivyWagmi();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  useFreeSubscribe({
    eventName: 'DuelCreated',
    listener(logs: any) {
      const duelId = logs[0]?.args?.id?.toString();
      if (!duelId)
        return toast({
          title: 'There was a problem creating your duel.',
          description: 'Please try again.',
          variant: 'destructive',
        });
      router.push(`/practice/${duelId}`);
    },
  });

  async function handleCreateDuel() {
    setIsLoading(true);

    try {
      const chainId =
        process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;

      let provider = await wallets[0]?.getEthersProvider();
      wallets[0]?.switchChain(chainId);
      if (embeddedWallet) provider = await embeddedWallet?.getEthersProvider();

      const word = await generateWord();

      await createDuel(provider, word);

      va.track('CreatePractice', {
        address: wallet?.address as `0x${string}`,
      });
    } catch (e) {
      setIsLoading(false);
      const description = e?.message || 'Please try again.';
      return toast({
        title: 'Something went wrong.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="w-full p-2 bg-slate-800">
      {user ? (
        <Button
          className="w-full border-b border-background"
          onClick={handleCreateDuel}
          disabled={isLoading}
          size="lg"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create Practice
        </Button>
      ) : (
        <GetStarted />
      )}
    </div>
  );
}
