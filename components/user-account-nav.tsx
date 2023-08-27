'use client';

import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from './icons';
import { magic } from '@/lib/magic';
import { toast } from '@/components/ui/use-toast';

const formatAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-4);
};

export function UserAccountNav({ user, setUser }: any) {
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(user.publicAddress);
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
        <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
          <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            <Icons.user className="h-4 w-4" />
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.publicAddress && (
              <p onClick={copyAddress} className="font-medium cursor-pointer">
                {formatAddress(user.publicAddress)}
              </p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            target="_blank"
            className="cursor-pointer"
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${user.publicAddress}`}
          >
            Transactions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/new">
            New Duel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            magic.user.logout();
            setUser(null);
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
