'use client';

import Loading from './loading';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useXPRead } from '@/hooks/useXPRead';
import GetETH from './get-eth';
import GetStarted from './get-started';
import ClaimXP from './claim-xp';
import { useQuery } from '@tanstack/react-query';
import { getUserDuels } from '@/lib/db';
import BuyXP from './buy-xp';
import WordDuelPlayDuel from './wordduel-play-duel';
import { useEffect, useState } from 'react';
import { useAISubscribe } from '@/hooks/useAISubscribe';
import Link from 'next/link';
import { Button } from './ui/button';
import { Icons } from './icons';

export default function WordDuel() {
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const { data: xpBalance } = useXPRead({
    functionName: 'balanceOf',
    args: [address],
  });
  const { data: queryDuels, isLoading } = useQuery({
    queryKey: ['duels', address],
    queryFn: () => getUserDuels(address),
  });
  const [XP, setXP] = useState<number>(0);
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

  useEffect(() => {
    setXP(parseInt(xpBalance || '0') / 10 ** 18);
  }, [xpBalance]);

  useAISubscribe({
    eventName: 'BuyTokens',
    listener(logs: any) {
      const buyer = logs[0]?.args?.buyer;
      if (buyer !== address) return;
      setXP(2);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <GetStarted>
      <GetETH>
        <ClaimXP>
          {XP !== 0 && !newGame && !reward && (
            <div className="flex flex-col max-w-md mx-auto gap-4 py-48 px-4 text-center">
              <Icons.swords className="h-8 w-8 mx-auto" />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-black">Level {level}</h2>
                <p className="text-sm">
                  If you win, you'll earn 2 $XP and get to the next level. The
                  higher the level, the smarter the AI. Good luck!
                </p>
              </div>
              <Link className="w-full" href="/approve">
                <Button className="w-full" size="lg">
                  Create Duel
                </Button>
              </Link>
            </div>
          )}
          {newGame && <WordDuelPlayDuel gameId={newGame.id} level={level} />}
          {reward && <WordDuelPlayDuel gameId={reward.id} level={level} />}
          {XP === 0 && !newGame && !reward && <BuyXP />}
        </ClaimXP>
      </GetETH>
    </GetStarted>
  );
}
