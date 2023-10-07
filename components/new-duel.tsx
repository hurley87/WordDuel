'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useSubscribe } from '@/hooks/useSubscribe';
import { useWrite } from '@/hooks/useWrite';
import va from '@vercel/analytics';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { parseEther } from 'viem';
import { generateWord } from '@/lib/wordle';

export function NewDuel() {
  const [amount, setAmount] = React.useState<number>(0.001);
  const router = useRouter();
  const { wallet } = usePrivyWagmi();
  const { isLoading, write } = useWrite('createDuel');

  useSubscribe({
    eventName: 'DuelCreated',
    listener(logs: any) {
      const duelId = logs[0]?.args?.id?.toString();
      if (!duelId)
        return toast({
          title: 'There was a problem creating your duel.',
          description: 'Please try again.',
          variant: 'destructive',
        });
      router.push(`/duel/${duelId}`);
    },
  });

  async function createDuel() {
    try {
      const word = await generateWord();

      write({
        args: [word],
        from: wallet?.address as `0x${string}`,
        value: parseEther(amount.toString()),
      });

      va.track('CreateDuel', {
        address: wallet?.address as `0x${string}`,
      });
    } catch (e) {
      const description = e?.message || 'Please try again.';
      return toast({
        title: 'Something went wrong.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <Label htmlFor="amount">Cost per move (ETH)</Label>
        <Input
          id="amount"
          placeholder="0.001"
          type="number"
          step="0.0001"
          inputMode="decimal"
          disabled={isLoading}
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </div>
      <button
        className={cn(buttonVariants({ size: 'lg' }))}
        disabled={isLoading}
        onClick={createDuel}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Create Duel
      </button>
    </div>
  );
}