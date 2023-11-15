import { useContractWrite } from 'wagmi';
import OpenDuels from '@/hooks/abis/OpenDuels.json';

export const useWrite = (functionName: any) => {
  const address = process.env
    .NEXT_PUBLIC_DUELS_CONTRACT_ADDRESS as `0x${string}`;
  const abi = OpenDuels.abi;

  return useContractWrite({
    address,
    abi,
    functionName,
  }) as any;
};
