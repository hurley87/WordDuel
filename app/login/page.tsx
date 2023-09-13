import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { UserAuthForm } from '@/components/user-auth-form';
import { UserAuthGoogle } from '@/components/user-auth-google';

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Submit an email or continue with Google.
          </p>
        </div>
        <UserAuthForm />
        <UserAuthGoogle />
      </div>
    </div>
  );
}
