'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Logout() {
  const { logout } = usePrivy();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <Button size="lg" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
