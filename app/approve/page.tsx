'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useXPWrite } from '@/hooks/useXPWrite';
import { makeBig } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { useXPRead } from '@/hooks/useXPRead';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useXPSubscribe } from '@/hooks/useXPSubscribe';
import { useRouter } from 'next/navigation';

export default function ApproveXP() {
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const aiContractAddress = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const { write: approve } = useXPWrite('approve');
  const router = useRouter();

  useXPSubscribe({
    eventName: 'Approval',
    listener(logs: any) {
      const owner = logs[0]?.args?.owner;
      if (owner.toLowerCase() !== address.toLowerCase()) return;
      router.push('/create');
    },
  });

  async function approveXP() {
    setIsApproving(true);
    try {
      await approve({
        args: [aiContractAddress, makeBig(2)],
        from: address,
      });
    } catch {
      setIsApproving(false);
    }
  }

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
