'use client';

import { usePrivy } from '@privy-io/react-auth';
import Loading from './loading';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useXPRead } from '@/hooks/useXPRead';
import GetETH from './get-eth';
import { useBalance } from 'wagmi';
import GetStarted from './get-started';
import WordDuelCreateDuel from './wordduel-create-duel';
import { useAIRead } from '@/hooks/useAIRead';
import StakeXP from './stake-xp';
import ClaimXP from './claim-xp';
import { useQuery } from '@tanstack/react-query';
import { getUserDuels } from '@/lib/db';
import BuyXP from './buy-xp';
import WordDuelPlayDuel from './wordduel-play-duel';

export default function WordDuel() {
  const { user } = usePrivy();
  const { wallet: activeWallet } = usePrivyWagmi();
  const address = activeWallet?.address as `0x${string}`;
  const aiContractAddress = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
  const { data: xpAllowance } = useXPRead({
    functionName: 'allowance',
    args: [address, aiContractAddress],
  });
  const allowance = parseInt(xpAllowance || '0') / 10 ** 18;
  const { data: xpBalance } = useXPRead({
    functionName: 'balanceOf',
    args: [address],
  });
  const XP = parseInt(xpBalance || '0') / 10 ** 18;
  const { data: queryDuels, isLoading } = useQuery({
    queryKey: ['duels', address],
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
  const level = queryDuels?.length || 0;
  const { data: hasMinted } = useAIRead({
    functionName: 'claimedReward',
    args: [address],
  });
  const { data: balance } = useBalance({
    address,
  });
  const baseETH = parseFloat(balance?.formatted || '0');

  console.log('reward');
  console.log(reward);

  if (isLoading) return <Loading />;

  return (
    <>
      {user && baseETH > 0 && hasMinted && allowance >= 2 && !newGame && (
        <WordDuelCreateDuel address={address} level={level} />
      )}
      {user && baseETH > 0 && hasMinted && newGame && (
        <WordDuelPlayDuel gameId={newGame.id} level={level} />
      )}
      {user && baseETH > 0 && hasMinted && reward && (
        <WordDuelPlayDuel gameId={reward.id} level={level} />
      )}
      {user && baseETH > 0 && hasMinted && XP === 0 && !newGame && !reward && (
        <BuyXP />
      )}
      {user && allowance < 2 && hasMinted && XP > 0 && <StakeXP xp={XP} />}
      {user && baseETH > 0 && !hasMinted && <ClaimXP />}
      {user && baseETH === 0 && <GetETH />}
      {!user && <GetStarted />}
    </>
  );
}
