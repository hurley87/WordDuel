'use client';

import Loading from './loading';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import GetETH from './get-eth';
import GetStarted from './get-started';
import { useQuery } from '@tanstack/react-query';
import { getUserDuels } from '@/lib/db';
import WordDuelPlayDuel from './wordduel-play-duel';
import Link from 'next/link';
import { Button } from './ui/button';
import { Icons } from './icons';

export default function WordDuel() {
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const { data: queryDuels, isLoading } = useQuery({
    queryKey: ['games', address],
    queryFn: () => getUserDuels(address),
  });
  const newGames = queryDuels?.filter((duel: any) => duel.is_over === false);
  const newGame = newGames?.[0];
  const rewards = queryDuels?.filter(
    (duel: any) =>
      duel.is_over === true &&
      duel.is_winner === true &&
      duel.has_claimed === false
  );
  const reward = rewards?.[0];
  const level =
    queryDuels?.filter((duel) => duel.is_winner === true).length || 0;

  if (isLoading) return <Loading />;

  return (
    <GetStarted>
      <GetETH>
        {!newGame && !reward && (
          <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-4 text-center">
            <Icons.swords className="h-8 w-8 mx-auto" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-black">Level {level}</h2>
              <p className="text-sm">
                If you win, you'll earn 0.02 ETH and get to the next level. The
                higher the level, the smarter the AI. Good luck!
              </p>
            </div>
            <Link className="w-full" href="/create">
              <Button className="w-full" size="lg">
                Create Duel
              </Button>
            </Link>
          </div>
        )}
        {newGame && <WordDuelPlayDuel gameId={newGame.id} level={level} />}
        {reward && <WordDuelPlayDuel gameId={reward.id} level={level} />}
      </GetETH>
    </GetStarted>
  );
}
