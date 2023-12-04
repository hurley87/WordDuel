'use client';

import { Icons } from '@/components/icons';
import { usePrivy } from '@privy-io/react-auth';
import Loading from './loading';
import { Button } from './ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AI from '@/hooks/abis/AIDuels.json';
import { toast } from './ui/use-toast';
import { ethers } from 'ethers';

export default function WordDuelClaim({ duelId }: { duelId: number }) {
  const { ready } = usePrivy();
  const [isClaiming, setIsClaiming] = useState(false);

  const router = useRouter();

  async function handleClaimReward() {
    setIsClaiming(true);
    try {
      console.log('claiming reward');
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_WALLET_KEY as string;
      const wallet = new ethers.Wallet(privateKey, provider);
      const contractAddress = process.env
        .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as string;
      const contractABI = AI.abi;
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        wallet
      );
      const tx = await contract.finishDuel(`${duelId}`);
      await tx.wait();
      console.log('tx', tx);
      toast({
        title: 'Your reward is on the way!',
        description: 'Check your email for instructions.',
      });
      router.push('/');
    } catch (error) {
      console.log('error', error);
      const description = (error as Error)?.message || 'Please try again.';
      setIsClaiming(false);
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    }
  }

  if (!ready) return <Loading />;

  return (
    <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
      <Icons.wallet className="h-8 w-8 mx-auto" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black">You won 0.02 ETH</h2>
      </div>
      <Button disabled={isClaiming} onClick={handleClaimReward} size="lg">
        {isClaiming ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.wallet className="mr-2 h-4 w-4" />
        )}
        Claim Your Reward
      </Button>
    </div>
  );
}
