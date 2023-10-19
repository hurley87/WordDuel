'use client';

import Duels from '@/components/duels';
import Loading from '@/components/loading';
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { ready } = usePrivy();

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto">
      <Duels />
    </div>
  );
}
