import { type ClassValue, clsx } from 'clsx';
import { ethers } from 'ethers';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const DUEL_STATE = ['Created', 'Accepted', 'Finished', 'Cancelled'];

export const formatAddress = (address: string) => {
  return address?.slice(0, 4) + '...' + address?.slice(-4);
};

export async function getTwitterUsername(address: string) {
  const res = await fetch('/api/twitter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
    }),
  });
  const data = await res.json();
  return data.username;
}
``;
export const makeBig = (value: number) => {
  const valueString = value.toString();
  return ethers.utils.parseUnits(valueString);
};

export const makeSmall = (value: any) => {
  return parseInt(value) / 10 ** 18;
};
