import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { Icons } from './icons';
import { toast } from './ui/use-toast';
import Link from 'next/link';
import { useAIRead } from '@/hooks/useAIRead';
import { useAISubscribe } from '@/hooks/useAISubscribe';
import Loading from './loading';
import { base, baseGoerli } from 'viem/chains';
import { useWallets } from '@privy-io/react-auth';
import { claimReward } from '@/lib/gelato';
import va from '@vercel/analytics';

export default function ClaimXP({ children }: { children?: any }) {
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const { data: has_claimed, isLoading } = useAIRead({
    functionName: 'claimedReward',
    args: [address],
  });
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet?.walletClientType === 'privy'
  );

  useEffect(() => {
    setHasClaimed(has_claimed);
  }, [has_claimed]);

  useAISubscribe({
    eventName: 'RewardClaimed',
    listener(logs: any) {
      const winner = logs[0]?.args?.winner;
      if (winner === address) setHasClaimed(true);
    },
  });

  async function claim() {
    setIsClaiming(true);
    try {
      const chainId =
        process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;

      let provider = (await wallets[0]?.getEthersProvider()) as any;
      wallets[0]?.switchChain(chainId);
      if (embeddedWallet) provider = await embeddedWallet?.getEthersProvider();

      await claimReward(provider);

      va.track('RewardClaimed', {
        address,
      });
    } catch (error) {
      const description = (error as Error)?.message || 'Please try again.';
      setIsClaiming(false);
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    }
  }

  if (isLoading) return <Loading />;

  return (
    <>
      {hasClaimed ? (
        children
      ) : (
        <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
          <Icons.wallet className="h-8 w-8 mx-auto" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">Claim Your $XP</h2>
            <p className="text-sm">
              The{' '}
              <Link
                target="_blank"
                className="underline"
                href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/token/${process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS}`}
              >
                $XP token
              </Link>{' '}
              is the official currency of WordDuel. You'll earn tokens for each
              word you guess correctly.
            </p>
          </div>
          <Button
            disabled={isClaiming}
            onClick={claim}
            className="w-full"
            size="lg"
          >
            {isClaiming && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Claim 2 $XP Tokens
          </Button>
        </div>
      )}
    </>
  );
}
