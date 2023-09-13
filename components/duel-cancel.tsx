'use client';

import { useWrite } from '@/hooks/useWrite';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';

export const DuelCancel = ({ duelId }: { duelId: string }) => {
  const contract = useWrite();
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const router = useRouter();

  async function handleCancellation() {
    setIsCancelling(true);
    await contract?.createDuel(duelId);
    router.push('/');
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Cancel this duel and get reimbursed.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          disabled={isCancelling}
          onClick={handleCancellation}
          className="w-full"
          variant="outline"
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
