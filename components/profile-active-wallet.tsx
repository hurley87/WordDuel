'use client';

import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { Button } from '@/components/ui/button';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { toast } from '@/components/ui/use-toast';
import { formatAddress } from '@/lib/utils';
import { CardContent } from './ui/card';

function ProfileActiveWallet() {
  const { wallet: activeWallet } = usePrivyWagmi();

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
        <CardDescription>
          <p>Your active wallet address</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs">{activeWallet?.address}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCopyAddress}
          className="w-full"
          variant="outline"
        >
          Copy Wallet Address
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileActiveWallet;
