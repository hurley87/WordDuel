'use client';

import { Icons } from '@/components/icons';
import { Button } from './ui/button';
import Link from 'next/link';

export default function WordDuelClaimReward({
  gameId,
  level,
}: {
  gameId: number;
  level: number;
}) {
  return (
    <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-4 text-center">
      <Icons.swords className="h-8 w-8 mx-auto" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black">Level {level}</h2>
        <p className="text-sm">
          Congratulations! You won 2 $XP. Claim your reward.
        </p>
      </div>
      <Link className="w-full" href={`/game/${gameId}`}>
        <Button className="w-full" size="lg">
          Continue
        </Button>
      </Link>
    </div>
  );
}
