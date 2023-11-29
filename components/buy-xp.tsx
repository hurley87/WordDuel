import { Icons } from './icons';
import { useBalance } from 'wagmi';
import { toast } from './ui/use-toast';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAIWrite } from '@/hooks/useAIWrite';
import { ethers } from 'ethers';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function BuyXP() {
  const { wallet } = usePrivyWagmi();
  const address = wallet?.address as `0x${string}`;
  const [isSending, setIsSending] = useState(false);
  const { write: buyTokens } = useAIWrite('buyTokens');
  const { data: balance } = useBalance({
    address,
  });
  const baseETH = parseFloat(balance?.formatted || '0');

  async function handleBuyTokens() {
    setIsSending(true);
    try {
      buyTokens({
        args: [],
        from: address,
        value: ethers.utils.parseEther('0.02'),
      });
      toast({
        title: 'Your ETH is on the way!',
        description: 'Check your email for instructions.',
      });
      setIsSending(false);
    } catch (error) {
      const description = (error as Error)?.message || 'Please try again.';
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
      setIsSending(false);
    }
  }

  function handleCopyToClipBoard() {
    navigator.clipboard.writeText(address);
    return toast({
      title: 'Copied to clipboard.',
      description: 'Now send some ETH to your wallet.',
    });
  }

  return (
    <>
      {baseETH < 0.02 ? (
        <div className="flex flex-col max-w-md mx-auto gap-4 py-28 px-8">
          <Icons.wallet className="h-8 w-8" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">Fund your account.</h2>
            <p className="text-sm">
              {"You'll"} need 0.02 ETH in your wallet before you can continue.
              Get started by adding some ETH to your wallet shown below. If you
              don't have any Base ETH, you can bridge your ETH{' '}
              <Link
                target="_blank"
                className="underline"
                href="https://bridge.base.org/deposit"
              >
                here
              </Link>
              .
            </p>
          </div>

          <div
            onClick={handleCopyToClipBoard}
            className="flex items-center w-full rounded-md border shadow p-6 cursor-pointer"
          >
            <Icons.copy className="h-9 w-9" />
            <div className="ml-4 space-y-1 w-full">
              <p className="text-sm font-medium leading-none">Copy Address</p>
              <p className="text-sm text-muted-foreground text-blue-500">
                {address?.slice(0, 10)}...{address?.slice(-10)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <p className="text-sm">Wallet Balance: {baseETH.toFixed(4)} ETH </p>
            <Icons.refresh
              onClick={() => window.location.reload()}
              className="h-4 w-4 relative top-1 cursor-pointer"
            />
          </div>
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Be sure to send ETH to the address above on{' '}
              <Link
                target="_blank"
                className="underline"
                href="https://base.org/"
              >
                Base
              </Link>
              . Sending any other currency will result in a loss of funds.
            </AlertDescription>
          </Alert>
          <p className="text-sm">
            Once there is ETH in your wallet, you'll be able to play. We
            recommend at least 0.001 ETH to pay for gas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col max-w-md mx-auto gap-4 pt-40 px-8 text-center">
          <Icons.wallet className="h-8 w-8 mx-auto" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black">Buy More $XP to Continue</h2>
            <p className="text-sm">
              {"You'll"} buy 2 $XP tokens for 0.02 ETH. If you want to buy more,
              email dh@wordduel.xyz.
            </p>
          </div>
          {baseETH < 0.02 ? (
            <Alert variant="destructive">
              You need at least 0.02 ETH to buy more $XP.
            </Alert>
          ) : (
            <Button size="lg" disabled={isSending} onClick={handleBuyTokens}>
              {isSending ? 'On its way...' : 'Buy some $XP'}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
