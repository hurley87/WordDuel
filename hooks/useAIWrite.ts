import { useContractWrite } from 'wagmi';
import AI from '@/hooks/abis/AIDuels.json';

export const useAIWrite = (functionName: any) => {
  const address = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
  const abi = AI.abi;

  return useContractWrite({
    address,
    abi,
    functionName,
    onError(error) {
      console.log('Error', error);
    },
  }) as any;
};
