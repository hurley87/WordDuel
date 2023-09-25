import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import { magic } from './magic';
import { ethers } from 'ethers';

const relay = new GelatoRelay();

export async function getaloRequest(data: any) {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(
      magic.rpcProvider
    ) as any;
    const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
    const target = process.env
      .NEXT_PUBLIC_FREEDUELS_CONTRACT_ADDRESS as `0x${string}`;
    const request: any = {
      chainId,
      target,
      data,
      user: await provider.getSigner().getAddress(),
    };
    const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;
    const response = await relay.sponsoredCallERC2771(
      request,
      provider,
      apiKey
    );

    const taskId = response.taskId;
    console.log('response', taskId);

    return taskId;
  }
}
