import { Icons } from './icons';
import { useBalance } from 'wagmi';
import { toast } from './ui/use-toast';
import { formatAddress } from '@/lib/utils';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

export default function GetETH() {
  const { wallet } = usePrivyWagmi();
  const address = wallet?.address as `0x${string}`;
  const { data } = useBalance({
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

  return (
    <div className="flex flex-col max-w-lg mx-auto gap-4 py-10 px-8">
      <Icons.wallet className="h-8 w-8" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black">Get some ETH on Base</h2>
        <p className="text-sm">
          {"You'll"} use ETH, the official currency of Base, each time you make
          a move in WordDuel. Get started by adding some ETH to your wallet
          shown below.
        </p>
      </div>

      <div
        onClick={handleCopyToClipBoard}
        className="flex items-center w-full rounded-md border shadow p-6 cursor-pointer"
      >
        <Icons.copy className="h-9 w-9" />
        <div className="ml-4 space-y-1 w-full">
          <p className="text-sm font-medium leading-none">
            Copy Your Wallet Address
          </p>
          <p className="text-sm text-muted-foreground text-blue-500">
            {formatAddress(address)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <p>Wallet Balance: {balance} ETH </p>
        <Icons.refresh
          onClick={() => window.location.reload()}
          className="h-4 w-4 relative top-1 cursor-pointer"
        />
      </div>
    </div>
  );
}
