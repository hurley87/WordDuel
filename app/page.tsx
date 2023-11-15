'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Wordle from '@/components/wordle';
import HowToPlay from '@/components/how-to-play';
import { Icons } from '@/components/icons';

export default function Home() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="flex h-screen px-2">
      {showGame ? (
        <>
          <div className="absolute top-0 right-0 left-0 p-4 w-full flex justify-between">
            <h1 className="font-black text-xl">WordDuel</h1>
            <HowToPlay setShowGame={setShowGame} showGame={showGame}>
              <Icons.help className="h-7 w-7 cursor-pointer" />
            </HowToPlay>
          </div>
          <Wordle />
        </>
      ) : (
        <div className="m-auto flex flex-col gap-4 text-center w-full px-4 max-w-md">
          <Image
            className="rounded-lg mx-auto mb-2 shadow-sm shadow-white"
            alt="Word Duel logo"
            src="/logo.png"
            width={80}
            height={80}
          />
          <h1 className="font-black text-2xl">WordDuel</h1>
          <h3 className="text-lg md:text-2xl">Are you smarter than ChatGPT?</h3>
          <div className="flex flex-row gap-4 w-full">
            <HowToPlay showGame={showGame} setShowGame={setShowGame}>
              <Button className="w-full" variant="outline">
                How to play
              </Button>
            </HowToPlay>
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
