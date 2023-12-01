import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useXPWrite } from '@/hooks/useXPWrite';
import { makeBig } from '@/lib/utils';
import { Icons } from './icons';
import { useXPRead } from '@/hooks/useXPRead';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useXPSubscribe } from '@/hooks/useXPSubscribe';

export default function StakeXP({ children }: { children?: any }) {
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const aiContractAddress = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
  const { data: xpAllowance } = useXPRead({
    functionName: 'allowance',
    args: [address, aiContractAddress],
  });
  const allowance = parseInt(xpAllowance || '0') / 10 ** 18;
  const { data: xpBalance } = useXPRead({
    functionName: 'balanceOf',
    args: [address],
  });
  const XP = parseInt(xpBalance || '0') / 10 ** 18;
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const { write: approve } = useXPWrite('approve');
  const [hasStaked, setHasStaked] = useState<boolean>(true);

  useEffect(() => {
    setHasStaked(allowance < 2 && XP >= 2);
  }, [allowance, XP]);

  useXPSubscribe({
    eventName: 'Approval',
    listener(logs: any) {
      const owner = logs[0]?.args?.owner;
      if (owner.toLowerCase() !== address.toLowerCase()) return;
      setHasStaked(false);
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
    <>
      {!hasStaked ? (
        children
      ) : (
        <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
          <Icons.wallet className="h-8 w-8 mx-auto" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">Stake Your $XP</h2>
            <p className="text-sm">
              You'll have to stake 2 $XP to play. If you lose the game you'll
              lose those tokens. If you win you'll double your $XP.
            </p>
          </div>
          <Button disabled={isApproving} onClick={approveXP} size="lg">
            {isApproving ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.wallet className="mr-2 h-4 w-4" />
            )}
            Stake Your $XP
          </Button>
        </div>
      )}
    </>
  );
}
