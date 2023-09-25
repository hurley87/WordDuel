import { useContractEvent } from 'wagmi';
import FreeDuels from '@/hooks/abis/FreeDuels.json';

export const useFreeSubscribe = ({ eventName, listener }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const address = process.env
    .NEXT_PUBLIC_FREEDUELS_CONTRACT_ADDRESS as `0x${string}`;
  const abi = FreeDuels.abi;

  return useContractEvent({
    chainId,
    eventName,
    address,
    abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
