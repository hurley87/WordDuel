import { useContractRead } from 'wagmi';
import Duels from '@/hooks/abis/Duels.json';

export const useRead = ({ functionName, watch, args }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const address = process.env
    .NEXT_PUBLIC_DUELS_CONTRACT_ADDRESS as `0x${string}`;
  const abi = Duels.abi;

  return useContractRead({
    chainId,
    functionName,
    address,
    abi,
    watch,
    args,
  }) as any;
};
