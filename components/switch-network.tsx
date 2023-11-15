'use client';

import '@/styles/globals.css';

import { baseGoerli, base } from 'wagmi/chains';
import { useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { Button } from './ui/button';
import { Icons } from './icons';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { toast } from './ui/use-toast';

type SwitchNetworkProps = {
  children: React.ReactNode;
};

function SwitchNetwork({ children }: SwitchNetworkProps) {
  const { wallets } = useWallets();
  const { wallet: w, ready } = usePrivyWagmi();
  const [isLoading, setIsLoading] = useState(false);
  const wallet = wallets.find((wallet) => wallet.address === w?.address);

  const chainId =
    process.env.NODE_ENV === 'production'
      ? (base.id as number)
      : (baseGoerli.id as number);

  async function handleSwitchNetwork() {
    setIsLoading(true);

    try {
      wallets.forEach(async (wallet) => {
        await wallet.switchChain(chainId);
      });
    } catch (e) {
      const description = (e as Error)?.message || 'Something went wrong.';
      setIsLoading(false);
      toast({
        title: 'Error switching network.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <div>
      {ready && chainId.toString() !== wallet?.chainId.split(':')[1] && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full dark:border-slate-800 dark:bg-slate-950 text-center">
            <h1>Connect to the Base network.</h1>
            <Button onClick={handleSwitchNetwork}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Connect
            </Button>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export default SwitchNetwork;
