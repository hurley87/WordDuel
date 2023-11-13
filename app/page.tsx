'use client';

import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Wordle from '@/components/wordle';

export default function Home() {
  const { ready, user } = usePrivy();
  const [showGame, setShowGame] = useState(false);

  if (!ready) {
    return <Loading />;
  }

  console.log(user);

  return (
    <div className="flex h-screen px-2">
      {showGame ? (
        <Wordle />
      ) : (
        <div className="m-auto flex flex-col gap-4 text-center">
          <Image
            className="rounded-lg mx-auto mb-2 shadow-sm shadow-white"
            alt="Word Duel logo"
            src="/logo.png"
            width={80}
            height={80}
          />
          <h1 className="font-black text-2xl">WordDuel</h1>
          <h3 className="text-lg md:text-2xl">
            Guess a 5-letter word before ChatGPT
          </h3>
          <div className="flex flex-row gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  How to play
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>How to play</DialogTitle>
                  <DialogDescription>
                    Guess a 5-letter word before ChatGPT
                  </DialogDescription>
                </DialogHeader>
                <div className="text-left text-sm p-2">
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
                    Whover guesses the right word first wins the the game. If
                    you play for money, each player transfers ETH into a pot for
                    each guess. The winner is transferred all the ETH. If the
                    game is a draw, the pot is split evenly.
                  </p>
                </div>
                <DialogFooter>
                  <Button className="w-full" onClick={() => setShowGame(true)}>
                    Play WordDuel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button className="w-full" variant="outline">
              Log in
            </Button>
            <Button onClick={() => setShowGame(true)} className="w-full">
              Play
            </Button>
          </div>
          <p className="text-sm pt-20">
            Created by{' '}
            <Link
              target="_blank"
              className="underline"
              href="https://twitter.com/davidhurley87"
            >
              David Hurley
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
