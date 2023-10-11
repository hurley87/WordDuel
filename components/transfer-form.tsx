'use client';

import * as React from 'react';

import { formatAddress } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import {
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';
import { parseEther, parseGwei } from 'viem';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from './ui/card';

export function TransferForm() {
  const [to, setTo] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const { config } = usePrepareSendTransaction({
    to,
    value: parseEther(amount),
    gasPrice: parseGwei('20'),
  });

  const { data, isLoading, isSuccess, sendTransaction } =
    useSendTransaction(config);
  const { wallet: activeWallet } = usePrivyWagmi();
  const { data: balance } = useBalance({
    address: activeWallet?.address as `0x${string}`,
  });

  function handleTransfer() {
    try {
      sendTransaction?.();
      toast({
        title: 'Success',
        description: `${amount} ETH transferred to ${formatAddress(to)}.`,
      });
      setTo('');
      setAmount('');
    } catch (e) {
      const description = e?.message || 'Please try again.';
      return toast({
        title: 'Something went wrong.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardDescription className="whitespace-pre">
          Transfer ETH to another wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="address">{"Recipient's"} Wallet Address</Label>
            <Input
              id="address"
              placeholder="0x1D266998DA65E25DE8e1770d48e0E55DDEE39D24"
              type="text"
              autoCapitalize="none"
              disabled={isLoading}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="amount">
              <div className="flex justify-between">
                <p>ETH Amount</p>
                <p>
                  Balance: {parseFloat(balance?.formatted as string).toFixed(2)}{' '}
                  ETH
                </p>
              </div>
            </Label>
            <Input
              id="amount"
              placeholder="0.001"
              type="number"
              step="0.001"
              inputMode="decimal"
              disabled={isLoading}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isLoading}
          onClick={handleTransfer}
          variant="outline"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Transfer ETH
        </Button>
      </CardFooter>
    </Card>
  );
}
