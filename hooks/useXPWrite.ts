import { useContractWrite } from 'wagmi';
import XP from '@/hooks/abis/XP.json';
import { base, baseGoerli } from 'viem/chains';

export const useXPWrite = (functionName: any) => {
  const address = process.env.NEXT_PUBLIC_XP_CONTRACT_ADDRESS as `0x${string}`;
  const abi = XP.abi;
  // const chainId =
  //   process.env.NODE_ENV === 'production' ? base.id :;

  return useContractWrite({
    address,
    abi,
    functionName,
  }) as any;
};
