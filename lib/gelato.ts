import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import { ethers } from 'ethers';
import AIDuelsFree from '@/hooks/abis/AIDuelsFree.json';

const relay = new GelatoRelay();
const target = process.env.NEXT_PUBLIC_AIDUEL_CONTRACT_ADDRESS as `0x${string}`;
const abi = AIDuelsFree.abi;
const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;

async function getContract(provider: any) {
  const signer = provider.getSigner();
  const user = await signer.getAddress();
  const contract = new ethers.Contract(target, abi, signer);
  return { contract, user };
}

export async function claimReward(provider: any) {
  const { contract, user } = await getContract(provider);
  const { data } = await contract.populateTransaction.claimReward();

  return gelatoRequest(provider, data, user);
}

export async function approve(provider: any) {
  const { contract, user } = await getContract(provider);
  const { data } = await contract.populateTransaction.claimReward();

  return gelatoRequest(provider, data, user);
}

export async function createDuel(provider: any, word: string) {
  const { contract, user } = await getContract(provider);
  const { data } = await contract.populateTransaction.createDuel(word);

  return gelatoRequest(provider, data, user);
}

export async function acceptDuel(provider: any, duelId: string) {
  const { contract, user } = await getContract(provider);
  const { data } = await contract.populateTransaction.acceptDuel(duelId);

  return gelatoRequest(provider, data, user);
}

export async function cancelDuel(provider: any, duelId: string) {
  const { contract, user } = await getContract(provider);
  const { data } = await contract.populateTransaction.cancelDuel(duelId);

  return gelatoRequest(provider, data, user);
}

export async function makeMove(provider: any, duelId: string, word: string) {
  const { contract, user } = await getContract(provider);
  const { data } = await contract.populateTransaction.makeMove(duelId, word);

  return gelatoRequest(provider, data, user);
}

export async function gelatoRequest(provider: any, data: any, user: any) {
  const request: any = {
    chainId: (await provider.getNetwork()).chainId,
    target,
    data,
    user,
  };
  console.log('request', request);
  const response = await relay.sponsoredCallERC2771(request, provider, apiKey);

  console.log(response);

  return response.taskId;
}
