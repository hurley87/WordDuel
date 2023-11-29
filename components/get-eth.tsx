import { Icons } from './icons';
import { useBalance } from 'wagmi';
import { toast } from './ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import { Button } from './ui/button';
import Loading from './loading';

export default function GetETH({ children }: { children?: any }) {
  const { user } = usePrivy();
  const { wallet } = usePrivyWagmi();
  const address = wallet?.address as `0x${string}`;
  const { data, isLoading } = useBalance({
    address,
  });
  const balance = parseFloat(data?.formatted || '0');
  const [isSending, setIsSending] = useState(false);

  async function sendInvitation() {
    setIsSending(true);
    const email = user?.google ? user?.google?.email : user?.email?.address;
    const subject = 'Funding Your WordDuel Account';
    const content = `This is your wallet address: ${address}`;
    const cc = 'dhurls99@gmail.com';
    const body = JSON.stringify({
      email,
      cc,
      subject,
      content,
    });

    if (!email)
      return toast({
        title: 'Error',
        description: 'Please add an email to your account.',
      });

    await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    toast({
      title: 'Your ETH is on the way!',
      description: 'Check your email for instructions.',
    });
    setIsSending(false);
  }

  function handleCopyToClipBoard() {
    navigator.clipboard.writeText(address);
    return toast({
      title: 'Copied to clipboard.',
      description: 'Now send some ETH to your wallet.',
    });
  }

  if (isLoading) return <Loading />;

  return (
    <>
      {balance > 0 ? (
        children
      ) : (
        <>
          wallet?.connectorType === 'injected' ? (
          <div className="flex flex-col max-w-md mx-auto gap-4 py-28 px-8">
            <Icons.wallet className="h-8 w-8" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-black">Get some ETH on Base</h2>
              <p className="text-sm">
                {"You'll"} use ETH, the official currency of{' '}
                <Link
                  target="_blank"
                  className="underline"
                  href="https://base.org/"
                >
                  Base
                </Link>
                , to play WordDuel. Get started by adding some ETH to your
                wallet shown below. If you don't have any Base ETH, you can
                bridge your ETH{' '}
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
              <p className="text-sm">
                Wallet Balance: {balance.toFixed(4)} ETH{' '}
              </p>
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
          <div className="flex flex-col max-w-md mx-auto gap-4 py-28 px-8 text-center">
            <Icons.wallet className="h-8 w-8 mx-auto" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-black">Get some ETH on Base</h2>
              <p className="text-sm">
                {"You'll"} use ETH, the official currency of{' '}
                <Link
                  target="_blank"
                  className="underline"
                  href="https://base.org/"
                >
                  Base
                </Link>
                , to play WordDuel. Notify us and we'll send you some to your
                account.
              </p>
            </div>
            <Button size="lg" disabled={isSending} onClick={sendInvitation}>
              {isSending ? 'Sending...' : 'Get some ETH'}
            </Button>
            <div className="flex gap-2">
              <p className="text-sm">
                Wallet Balance: {balance.toFixed(4)} ETH{' '}
              </p>
              <Icons.refresh
                onClick={() => window.location.reload()}
                className="h-4 w-4 relative top-1 cursor-pointer"
              />
            </div>
          </div>
          );
        </>
      )}
    </>
  );
}
