import { Button } from './ui/button';
import { useWrite } from '@/hooks/useWrite';
import { Icons } from './icons';
import { useSubscribe } from '@/hooks/useSubscribe';
import { toast } from './ui/use-toast';
import va from '@vercel/analytics';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { parseEther } from 'viem';

export const DuelCreatedOpponent = ({ duel }: { duel: any }) => {
  const { wallet } = usePrivyWagmi();
  const { write, isLoading } = useWrite('acceptDuel');
  const amount = (Number(duel.moveAmount) / 10 ** 18).toString();

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
        args: [duel.id.toString()],
        from: wallet?.address as `0x${string}`,
        value: parseEther(amount.toString()),
      });

      va.track('AcceptDuel', {
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
    <div className="flex flex-col gap-2 max-w-sm mx-auto">
      <Button
        disabled={isLoading}
        onClick={handleAcceptDuel}
        className="w-full"
        size="lg"
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Join Game ({amount} ETH)
      </Button>
    </div>
  );
};
