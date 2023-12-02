import { useContractRead } from 'wagmi';
import XP from '@/hooks/abis/XP.json';

export const useXPRead = ({ functionName, args }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const address = process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS as `0x${string}`;
  const abi = XP.abi;

  return useContractRead({
    chainId,
    functionName,
    address,
    abi,
    args,
  }) as any;
};
