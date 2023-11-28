import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import HowToPlay from '@/components/how-to-play';
import Link from 'next/link';

export default function GetStarted() {
  const { login } = usePrivy();

  return (
    <div className="m-auto flex flex-col gap-4 text-center w-full px-4 max-w-md pt-40">
      <Image
        className="rounded-lg mx-auto mb-2 shadow-sm shadow-white"
        alt="Word Duel logo"
        src="/logo.png"
        width={80}
        height={80}
      />
      <h1 className="font-black text-2xl">WordDuel</h1>
      <h3 className="text-lg md:text-xl">Guess the right word and earn $XP</h3>
      <div className="flex flex-row gap-4 w-full">
        <HowToPlay>
          <Button className="w-full" variant="outline">
            How to play
          </Button>
        </HowToPlay>
        <Button onClick={login} className="w-full">
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
  );
}
