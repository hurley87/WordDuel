'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/lib/UserContext';
import { useFreeSubscribe } from '@/hooks/useFreeSubscribe';
import { generateWord } from '@/lib/wordle';
import { useFreeWrite } from '@/hooks/useFreeWrite';
import { getaloRequest } from '@/lib/gelato';
import va from '@vercel/analytics';

export function PracticeDuelForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const [user, _]: any = React.useContext(UserContext);
  const contract = useFreeWrite();
  const [email, setEmail] = React.useState<string>('');

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();

    try {
      const word = await generateWord();

      if (email === user?.email) {
        setIsLoading(false);
        return toast({
          title: 'Please enter a different email.',
          description: 'You cannot duel yourself.',
          variant: 'destructive',
        });
      }

      const data = await contract?.populateTransaction.createDuel(email, word);
      await getaloRequest(data?.data);

      va.track('CreatePractice', {
        address: user?.publicAddress,
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
    <form onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className={cn(buttonVariants({ size: 'lg' }))}
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create Practice Duel
        </button>
      </div>
    </form>
  );
}
