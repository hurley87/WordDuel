import OpenFreeDuels from '@/hooks/abis/OpenFreeDuels.json';
import { encodeFunctionData } from 'viem';

export const useFreeWrite = (functionName, args) => {
  const abi = OpenFreeDuels.abi;

  return encodeFunctionData({
    abi,
    functionName,
    args,
  });
};
