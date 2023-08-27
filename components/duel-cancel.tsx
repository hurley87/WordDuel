'use client';

import { useWrite } from '@/hooks/useWrite';
import { Button } from './ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';

export const DuelCancel = ({ duelId }: { duelId: string }) => {
  const { writeAsync: cancelDuel } = useWrite({
    functionName: 'cancelDuel',
  });
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const router = useRouter();

  async function handleCancellation() {
    setIsCancelling(true);
    await cancelDuel?.({
      args: [duelId],
    });
    router.push('/');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancel Duel</CardTitle>
        <CardDescription>Cancel this duel and get reimbursed.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          disabled={isCancelling}
          onClick={handleCancellation}
          className="w-full"
        >
          {isCancelling && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Cancel Duel
        </Button>
      </CardFooter>
    </Card>
  );
};
