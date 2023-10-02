'use client';

import { Icons } from '@/components/icons';
import { useBalance } from 'wagmi';
import Duels from '@/components/duels';
import Loading from '@/components/loading';
import { WalletWithMetadata, usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { toast } from '@/components/ui/use-toast';
import { formatAddress } from '@/lib/utils';

function ProfileAccounts() {
  const { ready, user, connectWallet, linkWallet, unlinkWallet } = usePrivy();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { data: balance } = useBalance({
    address: activeWallet?.address as `0x${string}`,
  });
  const { wallets: connectedWallets } = useWallets();

  if (!ready) {
    return <Loading />;
  }

  const wallets = user?.linkedAccounts.filter(
    (a) => a.type === 'wallet'
  ) as WalletWithMetadata[];

  console.log('activeWallet', activeWallet);
  console.log(user);
  console.log(balance);

  function unlink(address: string) {
    try {
      unlinkWallet(address);
    } catch (e) {
      const description = e?.response?.data?.message || e.message;
      toast({
        title: `Something went wrong.`,
        description,
        variant: 'destructive',
      });
    }
  }
  return (
    <div>
      <p>Active wallet is {activeWallet?.address || ''} </p>
      {wallets?.map((wallet) => {
        return (
          <div
            key={wallet.address}
            className="flex min-w-full flex-row flex-wrap items-center justify-between gap-2 p-4"
          >
            <div>{formatAddress(wallet.address)}</div>
            <Button
              onClick={() => {
                const connectedWallet = connectedWallets.find(
                  (w) => w.address === wallet.address
                );
                if (!connectedWallet) connectWallet();
                else setActiveWallet(connectedWallet);
              }}
              disabled={wallet.address === activeWallet?.address}
            >
              Make active
            </Button>
            <Button onClick={() => unlink(wallet.address)}>Unlink</Button>
          </div>
        );
      })}
      <Button size="lg" onClick={linkWallet}>
        Link another wallet
      </Button>
    </div>
  );
}

export default ProfileAccounts;
