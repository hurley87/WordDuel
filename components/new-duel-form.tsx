'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { newDuelSchema } from '@/lib/validations/new-duel';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/lib/UserContext';
import { parseEther } from 'viem';
import { useSubscribe } from '@/hooks/useSubscribe';
import { useWrite } from '@/hooks/useWrite';
import { useBalance } from 'wagmi';
import { generateWord } from '@/lib/wordle';

type FormData = z.infer<typeof newDuelSchema>;

export function NewDuelForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(newDuelSchema),
    defaultValues: {
      amount: 0.001,
      email: '',
    },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const [user, _]: any = React.useContext(UserContext);
  const { data } = useBalance({
    address: user?.publicAddress,
  });
  const balance = parseFloat(data?.formatted || '0');
  const contract = useWrite();

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
      const email = data.email.toLowerCase();
      const amount = data.amount;
      const word = await generateWord();
      const amountString = amount?.toString() as string;

      if (amount && balance < amount) {
        setIsLoading(false);
        return toast({
          title: 'You do not have enough funds.',
          description: 'Please deposit more funds.',
          variant: 'destructive',
        });
      }

      if (email === user?.email) {
        setIsLoading(false);
        return toast({
          title: 'Please enter a different email.',
          description: 'You cannot duel yourself.',
          variant: 'destructive',
        });
      }

      await contract?.createDuel(email, word, {
        value: parseEther(amountString),
      });
    } catch (e) {
      setIsLoading(false);
      const description = e?.data?.message || 'Please try again.';
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
          <Label htmlFor="email">{`Opponent's`} Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...register('email')}
          />
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="amount">ETH Amount</Label>
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
          Create Duel
        </button>
      </div>
    </form>
  );
}
