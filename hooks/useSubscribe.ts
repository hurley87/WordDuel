import { useContractEvent } from 'wagmi';
import Duels from '@/hooks/abis/Duels.json';

export const useSubscribe = ({ eventName, address, listener }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  return useContractEvent({
    chainId,
    eventName,
    address,
    abi: Duels.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
