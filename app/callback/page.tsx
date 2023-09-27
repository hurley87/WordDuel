'use client';

import Loading from '@/components/loading';
import { useContext, useEffect } from 'react';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';
import { useRouter } from 'next/navigation';
import va from '@vercel/analytics';

export default function FAQPage() {
  const [user, setUser]: any = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    async function load() {
      const result = await magic.oauth.getRedirectResult();

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${result.magic.didToken}`,
        },
      });

      // If successful, update our user state with their metadata and route to the dashboard
      if (res.ok) {
        const userMetadata = await magic.user.getMetadata();
        setUser(userMetadata);
        va.track('Login', {
          address: user?.publicAddress,
        });
        router.push('/');
      }
    }
    load();
  }, [router, setUser, user?.email, user?.publicAddress]);

  return <Loading />;
}
