'use client';

import '@/styles/globals.css';
import { Icons } from './icons';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useBalance } from 'wagmi';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function Header() {
  const { user } = usePrivy();
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const { data: balance } = useBalance({
    address,
  });

  return (
    <header className="border-b bg-background fixed top-0 w-full">
      <div className="flex h-11 items-center justify-between p-2 lg:px-20">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-1">
            <Icons.swords className="h-4 w-4" />
            <span className="font-bold">WordDuel</span>
          </Link>
        </div>
        <Dialog>
          <DialogTrigger>
            <Badge
              className="text-xs rounded-full p-0.5 cursor-pointer"
              variant="secondary"
            >
              <Icons.help className="" />
            </Badge>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">How To Play</DialogTitle>
              <DialogDescription>
                <div className="text-left">
                  <p>
                    You and your opponent take turns guessing the right word.
                  </p>
                  <ul className="list-disc pt-4 list-inside">
                    <li>Each guess must be a valid 5-letter word.</li>
                    <li>Letter colors will give you hints.</li>
                  </ul>
                  <div className="flex flex-col gap-4 py-4 block">
                    <p className="font-bold">Examples</p>
                    <div className="flex gap-1 text-lg">
                      <div className="border-2 border-green-500 py-1 px-2 bg-green-500 text-white">
                        W
                      </div>
                      <div className="border-2 border-accent py-1 px-2">E</div>
                      <div className="border-2 border-accent py-1 px-2">A</div>
                      <div className="border-2 border-accent py-1 px-2">R</div>
                      <div className="border-2 border-accent py-1 px-2">Y</div>
                    </div>
                    <p>
                      <b>W</b> is in the word and in the correct spot.
                    </p>
                    <div className="flex gap-1 text-lg">
                      <div className="border-2 border-accent py-1 px-2">P</div>
                      <div className="border-2 border-yellow-500 bg-yellow-500 text-white py-1 px-2">
                        I
                      </div>
                      <div className="border-2 border-accent py-1 px-2">L</div>
                      <div className="border-2 border-accent py-1 px-2">L</div>
                      <div className="border-2 border-accent py-1 px-2">S</div>
                    </div>
                    <p>
                      <b>I</b> is in the word but in the wrong spot.
                    </p>
                    <div className="flex gap-1 text-lg">
                      <div className="border-2 border-accent py-1 px-2">V</div>
                      <div className="border-2 border-accent py-1 px-2">A</div>
                      <div className="border-2 border-accent py-1 px-2">G</div>
                      <div className="border-2 border-gray-500 bg-gray-500 text-white py-1 px-2">
                        U
                      </div>
                      <div className="border-2 border-accent py-1 px-2">E</div>
                    </div>
                    <p>
                      <b>U</b> is not in the word in any spot.
                    </p>
                  </div>
                  <p>
                    Whover guesses the right word first wins the the game. If
                    you play for ETH, each player transfers ETH for each guess.
                    The winner is transferred all the ETH. If the game is a
                    draw, the pot is split evenly.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {user && (
          <Link className="cursor-pointer" href="/profile">
            <Badge className="text-sm" variant="secondary">
              {parseFloat(balance?.formatted as string).toFixed(3)} ETH
            </Badge>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
