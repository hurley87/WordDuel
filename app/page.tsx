'use client';

import Duels from '@/components/duels';
import Layout from '@/components/layout';
import Loading from '@/components/loading';
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { ready } = usePrivy();

  if (!ready) {
    return <Loading />;
  }

  return (
    <Layout title="WordDuel">
      <Duels />
    </Layout>
  );
}
