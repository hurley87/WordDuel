'use client';

import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { cancelDuel } from '@/lib/gelato';
import { useWallets } from '@privy-io/react-auth';

export const DuelCancelFree = ({ duelId }: { duelId: string }) => {
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const router = useRouter();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  async function handleCancellation() {
    setIsCancelling(true);
    const provider = await embeddedWallet?.getEthersProvider();

    await cancelDuel(provider, duelId);
    router.push('/');
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Cancel this game.</CardDescription>
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
          Cancel Game
        </Button>
      </CardFooter>
    </Card>
  );
};
