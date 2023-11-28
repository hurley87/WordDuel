import { useState } from 'react';
import { Button } from './ui/button';
import { useXPWrite } from '@/hooks/useXPWrite';
import { makeBig } from '@/lib/utils';
import { Icons } from './icons';

export default function StakeXP({ xp }: { xp: number }) {
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const { write: approve } = useXPWrite('approve');
  const aiContractAddress = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;

  async function approveXP() {
    setIsApproving(true);
    try {
      await approve({
        args: [aiContractAddress, makeBig(xp)],
      });
    } catch (error) {
      console.log(error);
      setIsApproving(false);
    }
  }

  return (
    <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-8 text-center">
      <Icons.wallet className="h-8 w-8 mx-auto" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black">Stake Your $XP</h2>
        <p className="text-sm">
          You'll have to stake 2 $XP to play. If you lose the game you'll lose
          those tokens. If you win you'll earn 2 $XP.
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
  );
}
