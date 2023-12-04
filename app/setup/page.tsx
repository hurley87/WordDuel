'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAIRead } from '@/hooks/useAIRead';
import { useAIWrite } from '@/hooks/useAIWrite';
import { useXPWrite } from '@/hooks/useXPWrite';
import { makeBig, makeSmall } from '@/lib/utils';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { parseEther } from 'viem';

export default function SetupPage() {
  const [mintAmount, setMintAmount] = useState('');
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const { write: mint } = useXPWrite('mint');
  const { write: fundGame, isLoading } = useAIWrite('fundGame');
  const { data: balance } = useAIRead({
    functionName: 'getTokenBalanceContract',
    args: [],
  });
  const { wallet } = usePrivyWagmi();
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const { write: approve } = useXPWrite('approve');
  const aiContractAddress = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;

  async function mintXP() {
    setIsMinting(true);
    try {
      mint({
        args: [makeBig(5)],
        from: wallet?.address,
      });
    } catch {}
  }

  async function approveXP() {
    console.log('approve');
    setIsApproving(true);
    try {
      approve({
        args: [aiContractAddress, makeBig(parseInt(amount))],
        from: wallet?.address as `0x${string}`,
      });
    } catch (error) {
      const description = (error as Error)?.message || 'Please try again.';
      toast({
        title: 'Something went wrong.',
        description,
        variant: 'destructive',
      });
      setIsApproving(false);
    }
  }

  function handleTransfer() {
    try {
      fundGame({
        args: [parseEther(amount)],
        from: wallet?.address as `0x${string}`,
      });

      toast({
        title: 'Success',
        description: `${amount} Tokens transferred to game.`,
      });
      setAmount('');
    } catch (e) {
      const description = (e as Error)?.message || 'Please try again.';
      return toast({
        title: 'Something went wrong.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="max-w-md mx-auto pt-20 flex flex-col gap-10">
      <h2>Current alance: {makeSmall(balance)}</h2>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="amount">
            <div className="flex justify-between">
              <p>Mint Amount</p>
            </div>
          </Label>
          <Input
            id="amount"
            placeholder="100"
            type="number"
            inputMode="decimal"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          disabled={isMinting}
          onClick={mintXP}
          variant="outline"
        >
          {isApproving && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Mint Tokens
        </Button>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="amount">
            <div className="flex justify-between">
              <p>Token Amount</p>
            </div>
          </Label>
          <Input
            id="amount"
            placeholder="100"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          disabled={isApproving}
          onClick={approveXP}
          variant="outline"
        >
          {isApproving && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Approve Transfer
        </Button>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="amount">
            <div className="flex justify-between">
              <p>Transfer Amount</p>
            </div>
          </Label>
          <Input
            id="amount"
            placeholder="100"
            type="number"
            step="100"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleTransfer}
          variant="outline"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Transfer Tokens
        </Button>
      </div>
    </div>
  );
}
