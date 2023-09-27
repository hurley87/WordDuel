'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import { cn, formatAddress } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/lib/UserContext';
import { useSubscribe } from '@/hooks/useSubscribe';
import { useBalance } from 'wagmi';
import { transferSchema } from '@/lib/validations/transfer';
import { useContext, useState } from 'react';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';

type FormData = z.infer<typeof transferSchema>;

export function TransferForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transferSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [user, _]: any = useContext(UserContext);
  const { data } = useBalance({
    address: user?.publicAddress,
  });
  const balance = parseFloat(data?.formatted || '0');

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

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const walletAddress = data.address.toLowerCase();
      const amount = data.amount;
      const amountString = amount?.toString() as string;

      if (amount && balance < amount) {
        setIsLoading(false);
        return toast({
          title: 'You do not have enough funds.',
          description: 'Please deposit more funds.',
          variant: 'destructive',
        });
      }

      if (walletAddress === user?.publicAddress) {
        setIsLoading(false);
        return toast({
          title: 'Please enter a different wallet address.',
          description: 'You cannot duel yourself.',
          variant: 'destructive',
        });
      }

      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
      const signer = provider.getSigner();
      const value = ethers.utils.parseEther(amountString);

      await signer.sendTransaction({
        to: walletAddress,
        value,
      });

      toast({
        title: 'Success',
        description: `${amountString} ETH transferred to ${formatAddress(
          walletAddress
        )}.`,
      });

      router.push('/');
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="address">Wallet Address</Label>
          <Input
            id="address"
            placeholder="0x1D266998DA65E25DE8e1770d48e0E55DDEE39D24"
            type="text"
            autoCapitalize="none"
            disabled={isLoading}
            {...register('address')}
          />
          {errors?.address && (
            <p className="px-1 text-xs text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="amount">
            <div className="flex justify-between">
              <p>ETH Amount</p>
              <p>Balance: {balance.toFixed(2)} ETH</p>
            </div>
          </Label>
          <Input
            id="amount"
            placeholder="0.001"
            type="number"
            step="0.001"
            inputMode="decimal"
            disabled={isLoading}
            {...register('amount')}
          />
          {errors?.amount && (
            <p className="px-1 text-xs text-red-600">{errors.amount.message}</p>
          )}
        </div>
        <button
          className={cn(buttonVariants({ size: 'lg' }))}
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Transfer ETH
        </button>
      </div>
    </form>
  );
}
