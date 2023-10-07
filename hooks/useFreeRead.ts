import { useContractRead } from 'wagmi';
import OpenFreeDuels from '@/hooks/abis/OpenFreeDuels.json';

export const useFreeRead = ({ functionName, watch, args }: any) => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const address = process.env
    .NEXT_PUBLIC_FREEDUELS_CONTRACT_ADDRESS as `0x${string}`;
  const abi = OpenFreeDuels.abi;

  return useContractRead({
    chainId,
    functionName,
    address,
    abi,
    watch,
    args,
  }) as any;
};
