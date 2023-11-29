'use client';

import Loading from './loading';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useXPRead } from '@/hooks/useXPRead';
import GetETH from './get-eth';
import GetStarted from './get-started';
import WordDuelCreateDuel from './wordduel-create-duel';
import StakeXP from './stake-xp';
import ClaimXP from './claim-xp';
import { useQuery } from '@tanstack/react-query';
import { getUserDuels } from '@/lib/db';
import BuyXP from './buy-xp';
import WordDuelPlayDuel from './wordduel-play-duel';
import { useEffect, useState } from 'react';
import { useAISubscribe } from '@/hooks/useAISubscribe';

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
          <StakeXP>
            {XP !== 0 && !newGame && (
              <WordDuelCreateDuel address={address} level={level} />
            )}
            {newGame && <WordDuelPlayDuel gameId={newGame.id} level={level} />}
            {reward && <WordDuelPlayDuel gameId={reward.id} level={level} />}
            {XP === 0 && !newGame && !reward && <BuyXP />}
          </StakeXP>
        </ClaimXP>
      </GetETH>
    </GetStarted>
  );
}
