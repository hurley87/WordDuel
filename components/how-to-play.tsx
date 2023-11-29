'use client';

import '@/styles/globals.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useAIRead } from '@/hooks/useAIRead';

type HowToPlayProps = {
  children: React.ReactNode;
};

function HowToPlay({ children }: HowToPlayProps) {
  const { data: gameBalance } = useAIRead({
    functionName: 'getTokenBalanceContract',
    args: [],
  });
  const gameXP = parseInt(gameBalance || '0') / 10 ** 18;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>WordDuel</DialogTitle>
          <DialogDescription>
            {gameXP} $XP tokens are in the{' '}
            <Link
              className="underline"
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS}`}
            >
              game contract
            </Link>
          </DialogDescription>
        </DialogHeader>
        <div className="text-left text-sm">
          <p>
            You and WordleGPT, an AI agent built to play Wordle, take turns
            guessing the right word.
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
              <div className="border-2 border-accent py-1 px-2">L</div>
              <div className="border-2 border-yellow-500 bg-yellow-500 text-white py-1 px-2">
                I
              </div>
              <div className="border-2 border-accent py-1 px-2">N</div>
              <div className="border-2 border-accent py-1 px-2">G</div>
              <div className="border-2 border-accent py-1 px-2">O</div>
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
            Whover guesses the right word first wins the game. If you win,
            you'll earn $XP tokens. Email dh@wordduel.xyz if you have any
            questions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HowToPlay;
