'use client';

import '@/styles/globals.css';
import { UserContext } from '@/lib/UserContext';
import { MagicAuthConnector } from '@magiclabs/wagmi-connector';
import { magic } from '@/lib/magic';
import { useEffect, useState } from 'react';
import { baseGoerli, base } from 'wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.NEXT_PUBLIC_NODE_ENV === 'dev' ? baseGoerli : base],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `https://powerful-nameless-hill.base-goerli.quiknode.pro/${process.env.NEXT_PUBLIC_QUICK_NODE}/`,
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
            rpcUrl: `https://powerful-nameless-hill.base-goerli.quiknode.pro/${process.env.NEXT_PUBLIC_QUICK_NODE}/`,
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
