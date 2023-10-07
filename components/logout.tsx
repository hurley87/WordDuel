'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';

function Logout() {
  const { logout } = usePrivy();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription className="whitespace-pre">
          Logout of your account.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Logout;
