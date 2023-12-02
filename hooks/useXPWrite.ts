import { usePrepareContractWrite } from 'wagmi';
import XP from '@/hooks/abis/XP.json';
import { base, baseGoerli } from 'viem/chains';

export const useXPWrite = (functionName: any, args: any) => {
  const address = process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS as `0x${string}`;
  const abi = XP.abi;
  const chainId =
    process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;

  console.log('useXPWrite', { functionName, args, address, abi, chainId });

  const { config } = usePrepareContractWrite({
    args,
    address,
    abi,
    functionName,
    chainId,
    onError: (error: any) => {
      console.log(error);
    },
  });

  return config;
};
