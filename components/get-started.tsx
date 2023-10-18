import { Button } from '@/components/ui/button';
import { Icons } from './icons';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function GetStarted() {
  const { login } = usePrivy();
  const router = useRouter();

  async function handleLogin() {
    login();
    router.push('/profile');
  }

  return (
    <div className="flex flex-col space-y-2 text-center pt-20">
      <Icons.swords className="mx-auto h-14 w-14" />
      <h1 className="text-3xl font-black tracking-tight">WordDuel</h1>
      <p className="text-muted-foreground pb-2">
        Play Wordle against your friends for ETH.
      </p>
      <Button className="mx-auto px-20 relative block" onClick={handleLogin}>
        Get Started
      </Button>
    </div>
  );
}
