import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const network = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
  chainId: parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string),
};

// Create client-side Magic instance
const createMagic = (key: string) => {
  return (
    typeof window != 'undefined' &&
    new Magic(key, {
      network,
      extensions: [new OAuthExtension()],
    })
  );
};

const key: string = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY || '';

export const magic: any = createMagic(key);
