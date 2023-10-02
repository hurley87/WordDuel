import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import { ethers } from 'ethers';

const relay = new GelatoRelay();

export async function getaloRequest(data: any, provider: any, address: string) {
  const chainId = parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string);
  const target = process.env
    .NEXT_PUBLIC_FREEDUELS_CONTRACT_ADDRESS as `0x${string}`;
  const request: any = {
    chainId,
    target,
    data,
    user: address,
  };
  const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;
  console.log('provider', provider);
  const Web3Provider = new ethers.providers.Web3Provider(provider);
  const response = await relay.sponsoredCallERC2771(
    request,
    Web3Provider as any,
    apiKey
  );

  return response.taskId;
}
