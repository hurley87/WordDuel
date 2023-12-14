'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useXPRead } from '@/hooks/useXPRead';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useXPSubscribe } from '@/hooks/useXPSubscribe';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ethers } from 'ethers';
import XPABI from '@/hooks/abis/XP.json';
import { useWallets } from '@privy-io/react-auth';
import { base, baseGoerli } from 'viem/chains';
import { gelatoRequest } from '@/lib/gelato';

export default function ApproveXP() {
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const { data: xpBalance } = useXPRead({
    functionName: 'balanceOf',
    args: [address],
  });
  const [XP, setXP] = useState<number>(0);
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet?.walletClientType === 'privy'
  );

  useEffect(() => {
    setXP(parseInt(xpBalance || '0') / 10 ** 18);
  }, [xpBalance]);

  const aiContractAddress = process.env
    .NEXT_PUBLIC_XP_CONTRACT_ADDRESS as `0x${string}`;
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const tokenAmount = ethers.utils.parseUnits('2');

  const abi = XPABI.abi;

  const router = useRouter();

  useXPSubscribe({
    eventName: 'Approval',
    listener(logs: any) {
      const owner = logs[0]?.args?.owner as string;
      if (owner.toLowerCase() !== address.toLowerCase()) return;
      router.push('/create');
    },
  });

  async function approveXP() {
    setIsApproving(true);
    try {
      const chainId =
        process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;

      let provider = (await wallets[0]?.getEthersProvider()) as any;
      wallets[0]?.switchChain(chainId);
      if (embeddedWallet) provider = await embeddedWallet?.getEthersProvider();

      const signer = provider.getSigner();
      const target = process.env
        .NEXT_PUBLIC_XP_CONTRACT_ADDRESS as `0x${string}`;
      const contract = new ethers.Contract(target, abi, signer);

      const { data } = await contract.populateTransaction.approve(
        aiContractAddress,
        tokenAmount
      );

      const user = await signer.getAddress();

      await gelatoRequest(provider, data, user);
    } catch {
      setIsApproving(false);
    }
  }

  if (XP === 0)
    return (
      <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-4 text-center">
        <Icons.swords className="h-8 w-8 mx-auto" />
        <div className="flex flex-col gap-2">
          <p className="text-xl font-black">You have 0 $XP</p>
          <p className="text-sm">
            You'll need at least 2 $XP to play. Continue to buy some.
          </p>
        </div>
        <Link className="w-full" href="/buy">
          <Button className="w-full" size="lg">
            Continue
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
      <Icons.wallet className="h-8 w-8 mx-auto" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black">Approve Transfer</h2>
        <p className="text-sm">
          Approve a transfer of 2 $XP to the AI Duel contract.
        </p>
      </div>
      <Button disabled={isApproving} onClick={approveXP} size="lg">
        {isApproving ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.wallet className="mr-2 h-4 w-4" />
        )}
        Approve 2 $XP Transfer
      </Button>
    </div>
  );
}
