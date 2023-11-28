import { Button } from './ui/button';
import { useWrite } from '@/hooks/useWrite';
import { Icons } from './icons';
import { useSubscribe } from '@/hooks/useSubscribe';
import { toast } from './ui/use-toast';
import va from '@vercel/analytics';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { parseEther } from 'viem';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { useRead } from '@/hooks/useRead';
import { formatAddress } from '@/lib/utils';

export const DuelCreatedOpponent = ({ duel }: { duel: any }) => {
  const { wallet } = usePrivyWagmi();
  const { write, isLoading } = useWrite('acceptDuel');
  const amount = (Number(duel.moveAmount) / 10 ** 18).toString();
  const { data: winsCount } = useRead({
    functionName: 'getWinsCount',
    args: [duel.challenger],
  });
  const { data: lossesCount } = useRead({
    functionName: 'getLossesCount',
    args: [duel.challenger],
  });
  const { data: drawsCount } = useRead({
    functionName: 'getDrawsCount',
    args: [duel.challenger],
  });
  const address = wallet?.address as `0x${string}`;

  useSubscribe({
    eventName: 'DuelAccepted',
    listener(logs: any) {
      const duelId = logs[0]?.args?.id?.toString();
      if (duelId) {
        return toast({
          title: 'Game has started.',
          description: 'Good luck!',
        });
      }
    },
  });

  async function handleAcceptDuel() {
    try {
      write({
        args: [duel?.id?.toString()],
        from: address,
        value: parseEther(amount.toString()),
      });

      va.track('AcceptDuel', {
        address: wallet?.address as `0x${string}`,
      });
    } catch (e) {
      const description = (e as Error)?.message || 'Please try again.';
      return toast({
        title: 'There was a problem creating your duel.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-0 max-w-md mx-auto">
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
            disabled={isLoading}
            onClick={handleAcceptDuel}
            className="w-full"
            size="lg"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Join Game ({amount} ETH)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
