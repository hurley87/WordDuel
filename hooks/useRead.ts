import { useContractRead } from 'wagmi';
import OpenDuels from '@/hooks/abis/OpenDuels.json';

export const useRead = ({ functionName, watch, args }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const address = process.env
    .NEXT_PUBLIC_DUELS_CONTRACT_ADDRESS as `0x${string}`;
  const abi = OpenDuels.abi;

  return useContractRead({
    chainId,
    functionName,
    address,
    abi,
    watch,
    args,
  }) as any;
};
