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
import { useEffect, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';

export function PracticeDuelCreate() {
  const { wallet } = usePrivyWagmi();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [word, setWord] = useState<string>('');
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  useEffect(() => {
    async function getWord() {
      const word = await generateWord();
      setWord(word);
    }
    getWord();
  }, []);

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
      const provider = await embeddedWallet?.getEthersProvider();

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
    <Button onClick={handleCreateDuel} size="lg" disabled={isLoading}>
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Create Practice Duel
    </Button>
  );
}