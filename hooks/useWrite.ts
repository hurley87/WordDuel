import { useContractWrite } from 'wagmi';
import Duels from '@/hooks/abis/Duels.json';

export const useWrite = ({ functionName }: any) => {
  const address = process.env
    .NEXT_PUBLIC_DUELS_CONTRACT_ADDRESS as `0x${string}`;
  const abi = Duels.abi;

  return useContractWrite({
    address,
    abi,
    functionName,
  }) as any;
};
