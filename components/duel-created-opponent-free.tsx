import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { Icons } from './icons';
import { Container } from './container';
import { useFreeSubscribe } from '@/hooks/useFreeSubscribe';
import { toast } from './ui/use-toast';
import { acceptDuel } from '@/lib/gelato';
import va from '@vercel/analytics';
import { useWallets } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export const DuelCreatedOpponentFree = ({ duel }: { duel: any }) => {
  const { wallet } = usePrivyWagmi();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  useFreeSubscribe({
    eventName: 'DuelAccepted',
    listener(logs: any) {
      const duelId = logs[0]?.args?.id?.toString();
      if (duelId) {
        setIsAccepting(false);
        return toast({
          title: 'Duel Accepted',
          description: 'Good luck!',
        });
      }
    },
  });

  async function handleAcceptDuel() {
    setIsAccepting(true);

    try {
      let provider = await wallets[0]?.getEthersProvider();
      if (embeddedWallet) provider = await embeddedWallet?.getEthersProvider();
      await acceptDuel(provider, duel.id.toString());

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
    <div className="flex flex-col gap-2 max-w-lg mx-auto">
      <Container>
        <Card>
          <CardHeader>
            <CardDescription>
              {"You've"} been challenged to a word duel. Accept the duel to play
              for free and earn bragging rights.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              disabled={isAccepting}
              onClick={handleAcceptDuel}
              className="w-full"
              size="lg"
            >
              {isAccepting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Accept Duel
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};
