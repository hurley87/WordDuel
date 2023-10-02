'use client';

import '@/styles/globals.css';

import { baseGoerli, base } from 'wagmi/chains';
import { configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';

const http = process.env.NEXT_PUBLIC_RPC_URL as string;

const configureChainsConfig = configureChains(
  [baseGoerli],
  [
    jsonRpcProvider({
      rpc: () => ({
        http,
      }),
    }),
  ]
);

function Privy({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        appearance: {
          theme: '#030711',
          accentColor: '#94A3B8',
          logo: 'https://www.wordduel.xyz/logo.png',
          showWalletLoginFirst: true,
        },
      }}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        {children}
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}

export default Privy;
