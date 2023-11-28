import { useState } from 'react';
import { Button } from './ui/button';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { Icons } from './icons';
import { toast } from './ui/use-toast';
import { useAIWrite } from '@/hooks/useAIWrite';
import Link from 'next/link';

export default function ClaimXP() {
  const { write: claimReward } = useAIWrite('claimReward');
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  function claim() {
    setIsClaiming(true);
    try {
      claimReward({
        args: [],
        from: address,
      });
    } catch (error) {
      console.log(error);
      setIsClaiming(false);
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
      <Icons.wallet className="h-8 w-8 mx-auto" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black">Claim Your $XP</h2>
        <p className="text-sm">
          The{' '}
          <Link
            target="_blank"
            className="underline"
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS}`}
          >
            $XP token
          </Link>{' '}
          is the official currency of WordDuel. You'll earn tokens for each word
          you guess correctly.
        </p>
      </div>
      <Button
        disabled={isClaiming}
        onClick={claim}
        className="w-full"
        size="lg"
      >
        {isClaiming && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Claim 2 $XP Tokens
      </Button>
    </div>
  );
}
