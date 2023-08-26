import { Magic } from 'magic-sdk';

const network = {
  rpcUrl: `https://powerful-nameless-hill.base-goerli.quiknode.pro/${process.env.NEXT_PUBLIC_QUICK_NODE}/`,
  chainId: parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string),
};

// Create client-side Magic instance
const createMagic = (key: string) => {
  return (
    typeof window != 'undefined' &&
    new Magic(key, {
      network,
    })
  );
};

const key: string = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY || '';

export const magic: any = createMagic(key);
