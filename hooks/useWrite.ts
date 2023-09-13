import Duels from '@/hooks/abis/Duels.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';

export const useWrite = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const address = process.env
      .NEXT_PUBLIC_DUELS_CONTRACT_ADDRESS as `0x${string}`;
    const abi = Duels.abi;
    return new ethers.Contract(address, abi, signer);
  }
};
