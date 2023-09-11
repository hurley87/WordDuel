import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function GetStarted({ r }) {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.swords className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">WordDuel</h1>
        <p className="text-sm text-muted-foreground pb-2">
          Enter your email to log in to your account
        </p>
        <Link href={`/login?r=${r}`}>
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
