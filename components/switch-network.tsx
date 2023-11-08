'use client';

import '@/styles/globals.css';

import { baseGoerli, base } from 'wagmi/chains';
import { useWallets } from '@privy-io/react-auth';
import { useEffect } from 'react';

function SwitchNetwork({ children }) {
  const { wallets } = useWallets();

  const chainId =
    process.env.NODE_ENV === 'production'
      ? (base.id as number)
      : (baseGoerli.id as number);

  async function handleSwitchNetwork() {
    // setIsLoading(true);
    const embeddedWallet = wallets.find(
      (wallet) => wallet.walletClientType === 'privy'
    );

    if (embeddedWallet) {
      await embeddedWallet?.switchChain(chainId);
    } else {
      await wallets[0]?.switchChain(chainId);
    }
  }

  useEffect(() => {
    handleSwitchNetwork();
  }, []);

  return <div>{children}</div>;
}

export default SwitchNetwork;
