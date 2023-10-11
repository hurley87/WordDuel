'use client';

import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import Loading from '@/components/loading';
import { WalletWithMetadata, usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { toast } from '@/components/ui/use-toast';
import { formatAddress } from '@/lib/utils';
import { CardContent } from './ui/card';
import { Switch } from './ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from './icons';

function ProfileAccounts() {
  const { ready, user, connectWallet, linkWallet, unlinkWallet } = usePrivy();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { wallets: connectedWallets } = useWallets();

  if (!ready) {
    return <Loading />;
  }

  const wallets = user?.linkedAccounts.filter(
    (a) => a.type === 'wallet'
  ) as WalletWithMetadata[];

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

  function handleCopyAddress() {
    navigator.clipboard.writeText(`${activeWallet?.address}`);
    toast({
      title: 'Address copied to clipboard',
      description: formatAddress(`${activeWallet?.address}`),
    });
  }

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardDescription>Your wallets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {wallets?.map((wallet) => {
            return (
              <div
                key={wallet.address}
                className="flex min-w-full flex-row flex-wrap items-center justify-between gap-2"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p onClick={handleCopyAddress}>
                        {formatAddress(wallet.address)}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy wallet address</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-wrap items-center gap-2">
                  <Switch
                    checked={wallet.address === activeWallet?.address}
                    onCheckedChange={() => {
                      const connectedWallet = connectedWallets.find(
                        (w) => w.address === wallet.address
                      );
                      if (!connectedWallet) connectWallet();
                      else setActiveWallet(connectedWallet);
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => unlink(wallet.address)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={linkWallet} className="w-full" variant="outline">
          Link another wallet
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileAccounts;
