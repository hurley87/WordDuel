'use client';

import '@/styles/globals.css';

import { base, baseGoerli } from 'wagmi/chains';
import { configureChains } from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const http = process.env.NEXT_PUBLIC_RPC_URL as string;
const chainId = process.env.NODE_ENV === 'production' ? base : baseGoerli;

const configureChainsConfig: any = configureChains(
  [chainId],
  [
    jsonRpcProvider({
      rpc: () => ({
        http,
      }),
    }),
  ]
);

function Privy({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
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
          showWalletLoginFirst: false,
        },
      }}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}

export default Privy;
