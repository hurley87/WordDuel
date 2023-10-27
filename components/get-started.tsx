import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function GetStarted() {
  const { login } = usePrivy();

  async function handleLogin() {
    login();
  }

  return (
    <Button className="w-full" size="lg" onClick={handleLogin}>
      Get Started
    </Button>
  );
}
