import { usePrepareContractWrite } from 'wagmi';
import AI from '@/hooks/abis/AIDuels.json';

export const useAIWrite = (functionName: any, args: any) => {
  const address = process.env
    .NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
  const abi = AI.abi;

  const { config } = usePrepareContractWrite({
    address,
    abi,
    functionName,
    args,
  });

  return config;
};
