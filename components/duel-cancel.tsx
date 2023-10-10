'use client';

import { useWrite } from '@/hooks/useWrite';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export const DuelCancel = ({ duelId }: { duelId: string }) => {
  const { wallet } = usePrivyWagmi();
  const { isLoading, write } = useWrite('cancelDuel');
  const router = useRouter();

  async function handleCancellation() {
    write({
      args: [duelId],
      from: wallet?.address as `0x${string}`,
    });
    router.push('/');
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Cancel this game and get reimbursed.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={handleCancellation}
          className="w-full"
          variant="outline"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Cancel Game
        </Button>
      </CardFooter>
    </Card>
  );
};
