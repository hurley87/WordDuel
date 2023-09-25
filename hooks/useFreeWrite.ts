import FreeDuels from '@/hooks/abis/FreeDuels.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';

export const useFreeWrite = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const address = process.env
      .NEXT_PUBLIC_FREEDUELS_CONTRACT_ADDRESS as `0x${string}`;
    const abi = FreeDuels.abi;
    return new ethers.Contract(address, abi, signer);
  }
};
