'use client';

import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { useState } from 'react';
import { Icons } from './icons';
import { cancelDuel } from '@/lib/gelato';
import { useWallets } from '@privy-io/react-auth';
import { baseGoerli, base } from 'wagmi/chains';

export const DuelCancelFree = ({ duelId }: { duelId: string }) => {
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  async function handleCancellation() {
    setIsCancelling(true);
    const chainId =
      process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;
    let provider = await wallets[0]?.getEthersProvider();
    wallets[0]?.switchChain(chainId);
    if (embeddedWallet) provider = await embeddedWallet?.getEthersProvider();
    await cancelDuel(provider, duelId);
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
