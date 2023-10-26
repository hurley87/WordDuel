'use client';

import '@/styles/globals.css';

import { baseGoerli, base } from 'wagmi/chains';
import { useWallets } from '@privy-io/react-auth';
import { useEffect } from 'react';

function SwitchNetwork({ children }) {
  const { wallets } = useWallets();

  useEffect(() => {
    async function switchToCorrectNetwork() {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === 'privy'
      );
      const chainId =
        process.env.NODE_ENV === 'production' ? base.id : baseGoerli.id;

      if (embeddedWallet) {
        await embeddedWallet?.switchChain(chainId);
      } else {
        await wallets[0]?.switchChain(chainId);
      }
    }
    switchToCorrectNetwork();
  }, [wallets]);

  return <>{children}</>;
}

export default SwitchNetwork;
