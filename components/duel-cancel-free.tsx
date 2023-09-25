'use client';

import { useWrite } from '@/hooks/useWrite';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { getaloRequest } from '@/lib/gelato';

export const DuelCancelFree = ({ duelId }: { duelId: string }) => {
  const contract = useWrite();
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const router = useRouter();

  async function handleCancellation() {
    setIsCancelling(true);
    const data = await contract?.populateTransaction.cancelDuel(duelId);
    await getaloRequest(data?.data);
    router.push('/');
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Cancel this duel.</CardDescription>
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
