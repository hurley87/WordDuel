'use client';

import { useWrite } from '@/hooks/useWrite';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { Icons } from './icons';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useState } from 'react';

export const DuelCancel = ({ duelId }: { duelId: string }) => {
  const { wallet } = usePrivyWagmi();
  const { write } = useWrite('cancelDuel');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Cancel and get reimbursed.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          disabled={isCancelling}
          onClick={() => {
            setIsCancelling(true);
            write({
              args: [duelId],
              from: wallet?.address as `0x${string}`,
            });
          }}
          className="w-full"
          variant="outline"
        >
          {isCancelling && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Cancel Game
        </Button>
      </CardFooter>
    </Card>
  );
};
