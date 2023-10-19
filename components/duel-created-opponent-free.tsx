import { useState } from 'react';
import { Button } from './ui/button';
import { Icons } from './icons';
import { useFreeSubscribe } from '@/hooks/useFreeSubscribe';
import { toast } from './ui/use-toast';
import { acceptDuel } from '@/lib/gelato';
import va from '@vercel/analytics';
import { useWallets } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { baseGoerli, base } from 'wagmi/chains';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { formatAddress } from '@/lib/utils';
import { useFreeRead } from '@/hooks/useFreeRead';

export const DuelCreatedOpponentFree = ({ duel }: { duel: any }) => {
  const { wallet } = usePrivyWagmi();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const { data: winsCount } = useFreeRead({
    functionName: 'getWinsCount',
    args: [duel.challenger],
  });
  const { data: lossesCount } = useFreeRead({
    functionName: 'getLossesCount',
    args: [duel.challenger],
  });
  const { data: drawsCount } = useFreeRead({
    functionName: 'getDrawsCount',
    args: [duel.challenger],
  });

  useFreeSubscribe({
    eventName: 'DuelAccepted',
    listener(logs: any) {
      const duelId = logs[0]?.args?.id?.toString();
      if (duelId) {
        setIsAccepting(false);
        return toast({
          title: 'Game has started.',
          description: 'Good luck!',
        });
      }
    },
  });

  async function handleAcceptDuel() {
    setIsAccepting(true);
    const chainId =
      process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;

    try {
      let provider = await wallets[0]?.getEthersProvider();
      wallets[0]?.switchChain(chainId);
      if (embeddedWallet) provider = await embeddedWallet?.getEthersProvider();
      await acceptDuel(provider, duel?.id?.toString());

      va.track('AcceptPractice', {
        address: wallet?.address as `0x${string}`,
      });
    } catch (e) {
      const description = e?.message || e;
      return toast({
        title: 'There was a problem creating your duel.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-0 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardDescription>
            Join this practice and compete in a free game of wordle against{' '}
            {formatAddress(duel.challenger)} ({winsCount?.toString() || 0}-
            {lossesCount?.toString() || 0}-{drawsCount?.toString() || 0}).
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            disabled={isAccepting}
            onClick={handleAcceptDuel}
            className="w-full"
          >
            {isAccepting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Join Practice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
