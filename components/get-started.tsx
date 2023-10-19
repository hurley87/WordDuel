import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function GetStarted() {
  const { login } = usePrivy();
  const router = useRouter();

  async function handleLogin() {
    login();
    router.push('/profile');
  }

  return (
    <Button className="w-full" size="lg" onClick={handleLogin}>
      Get Started
    </Button>
  );
}
