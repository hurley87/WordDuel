'use client';

import Loading from '@/components/loading';
import { useContext, useEffect } from 'react';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
  const [user, setUser]: any = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    async function load() {
      const result = await magic.oauth.getRedirectResult();
      // Send this token to our validation endpoint
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
        router.push('/');
      }
    }
    load();
  }, [router, setUser]);

  return <Loading />;
}
