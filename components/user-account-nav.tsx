'use client';

import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { formatAddress } from '@/lib/utils';
import { Badge } from './ui/badge';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useBalance } from 'wagmi';

export function UserAccountNav() {
  const { wallet: activeWallet } = usePrivyWagmi();
  const { data: balance } = useBalance({
    address: activeWallet?.address as `0x${string}`,
  });

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(activeWallet?.address as string);
      toast({
        title: 'Copied to clipboard',
        description: 'Your public address has been copied to your clipboard.',
      });
    } catch {
      toast({
        title: 'Something went wrong.',
        description:
          'Your public address could not be copied to your clipboard.',
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge className="	" variant="secondary">
          {parseFloat(balance?.formatted as string).toFixed(3)} ETH
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p
              onClick={copyAddress}
              className="font-medium cursor-pointer text-sm"
            >
              {formatAddress(activeWallet?.address as string)}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/profile">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            target="_blank"
            className="cursor-pointer"
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${activeWallet?.address}`}
          >
            View Explorer
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/duel">
            Duel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/practice">
            Practice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/faq">
            FAQ
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
