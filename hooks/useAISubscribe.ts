import { useContractEvent } from 'wagmi';
import AI from '@/hooks/abis/AIDuels.json';

export const useAISubscribe = ({ eventName, listener }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const address = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
  const abi = AI.abi;

  return useContractEvent({
    chainId,
    eventName,
    address,
    abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
