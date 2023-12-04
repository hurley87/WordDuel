import { Icons } from './icons';
import { useBalance } from 'wagmi';
import { toast } from './ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Loading from './loading';

export default function GetETH({ children }: { children?: any }) {
  const { wallet } = usePrivyWagmi();
  const address = wallet?.address as `0x${string}`;
  const { data, isLoading } = useBalance({
    address,
  });
  const balance = parseFloat(data?.formatted || '0');

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
              , to play WordDuel. Get started by adding some ETH to your wallet
              shown below. If you don't have any Base ETH, you can bridge your
              ETH{' '}
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
            <p className="text-sm">Wallet Balance: {balance.toFixed(4)} ETH </p>
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
            Once there is ETH in your wallet, you'll be able to play. Email
            dh@wordduel.xyz if you have any questions.
          </p>
        </div>
      )}
    </>
  );
}
