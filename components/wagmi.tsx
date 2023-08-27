'use client';

import '@/styles/globals.css';
import { UserContext } from '@/lib/UserContext';
import { MagicAuthConnector } from '@magiclabs/wagmi-connector';
import { magic } from '@/lib/magic';
import { useEffect, useState } from 'react';
import { baseGoerli, base } from 'wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const http = process.env.NEXT_PUBLIC_RPC_URL as string;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.NODE_ENV === 'development' ? baseGoerli : base],
  [
    jsonRpcProvider({
      rpc: () => ({
        http,
      }),
    }),
  ]
);

const wagmiClient = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MagicAuthConnector({
      chains,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string,
        isDarkMode: true,
        magicSdkConfiguration: {
          network: {
            rpcUrl: http,
            chainId: parseInt(process.env.NEXT_PUBLIC_DUELS_CHAIN_ID as string),
          },
        },
      },
    }),
  ],
});

function Wagmi({ children }) {
  const [user, setUser] = useState<any | null>();

  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getInfo().then((userData) => setUser(userData));
      } else {
        setUser(null);
      }
    });
  }, [setUser]);

  return (
    <WagmiConfig config={wagmiClient}>
      <UserContext.Provider value={[user, setUser]}>
        {children}
      </UserContext.Provider>
    </WagmiConfig>
  );
}

export default Wagmi;
