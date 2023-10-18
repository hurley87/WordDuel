'use client';

import '@/styles/globals.css';
import { Icons } from './icons';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useBalance } from 'wagmi';
import { Badge } from './ui/badge';
import { formatAddress } from '@/lib/utils';

function Header() {
  const { user } = usePrivy();
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const { data: balance } = useBalance({
    address,
  });
  if (!user) return null;
  return (
    <header className="border-b bg-background fixed top-0 w-full">
      <div className="flex h-11 items-center justify-between p-2 lg:px-20">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.swords className="h-5 w-5" />
            <span className="font-black">WordDuel</span>
          </Link>
        </div>
        <Link className="cursor-pointer" href="/profile">
          <Badge className="text-sm" variant="secondary">
            {parseFloat(balance?.formatted as string).toFixed(3)} ETH
          </Badge>
        </Link>
      </div>
    </header>
  );
}

export default Header;
