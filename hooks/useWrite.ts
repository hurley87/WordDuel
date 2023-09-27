import Duels from '@/hooks/abis/Duels.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { parseEther } from 'viem';
import { toast } from '@/components/ui/use-toast';

export const useWrite = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const address = process.env
      .NEXT_PUBLIC_DUELS_CONTRACT_ADDRESS as `0x${string}`;
    const abi = Duels.abi;
    const contract = new ethers.Contract(address, abi, signer);

    const createDuel = async (email, word, amountString): Promise<string> => {
      try {
        if (contract) {
          const gasPrice = await signer.getGasPrice();
          const gasLimit = await contract?.estimateGas.createDuel(email, word, {
            value: parseEther(amountString),
          });

          await contract?.createDuel(email, word, {
            value: parseEther(amountString),
            gasPrice,
            gasLimit,
          });

          return 'success';
        } else return '';
      } catch (e: any) {
        const description = e?.message || 'Please try again.';
        toast({
          title: 'Something went wrong.',
          description,
          variant: 'destructive',
        });
        return new Error('insufficient funds').message;
      }
    };

    const cancelDuel = async (duelId): Promise<string> => {
      try {
        if (contract) {
          const gasPrice = await signer.getGasPrice();
          const gasLimit = await contract?.estimateGas.cancelDuel(duelId);

          await contract?.cancelDuel(duelId, {
            gasPrice,
            gasLimit,
          });

          return 'success';
        } else return '';
      } catch (e: any) {
        const description = e?.message || 'Please try again.';
        toast({
          title: 'Something went wrong.',
          description,
          variant: 'destructive',
        });
        return new Error('insufficient funds').message;
      }
    };

    const acceptDuel = async (duelId, moveAmount): Promise<string> => {
      try {
        if (contract) {
          const gasPrice = await signer.getGasPrice();
          const gasLimit = await contract?.estimateGas.acceptDuel(duelId, {
            value: moveAmount,
          });

          await contract?.acceptDuel(duelId, {
            value: moveAmount,
            gasPrice,
            gasLimit,
          });

          return 'success';
        } else return '';
      } catch (e: any) {
        const description = e?.message || 'Please try again.';
        toast({
          title: 'Something went wrong.',
          description,
          variant: 'destructive',
        });
        return new Error('insufficient funds').message;
      }
    };

    const makeMove = async (duelId, word, moveAmount): Promise<string> => {
      try {
        if (contract) {
          const gasPrice = await signer.getGasPrice();
          const gasLimit = await contract?.estimateGas.makeMove(duelId, word, {
            value: moveAmount,
          });

          await contract?.makeMove(duelId, word, {
            value: moveAmount,
            gasPrice,
            gasLimit,
          });

          return 'success';
        } else return '';
      } catch (e: any) {
        const description = e?.message || 'Please try again.';
        toast({
          title: 'Something went wrong.',
          description,
          variant: 'destructive',
        });
        return new Error('insufficient funds').message;
      }
    };

    return { createDuel, cancelDuel, acceptDuel, makeMove };
  } else {
    throw new Error('No RPC provider');
  }
};
