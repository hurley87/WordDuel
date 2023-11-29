import { useContractEvent } from 'wagmi';
import XP from '@/hooks/abis/XP.json';

export const useXPSubscribe = ({ eventName, listener }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const address = process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS as `0x${string}`;
  const abi = XP.abi;

  return useContractEvent({
    chainId,
    eventName,
    address,
    abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
