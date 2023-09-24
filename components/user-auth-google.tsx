'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { magic } from '@/lib/magic';
import { BsGoogle } from 'react-icons/bs';

export function UserAuthGoogle() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function loginWithGoogle() {
    setIsLoading(true);

    try {
      // Log in using our email with Magic and store the returned DID token in a variable
      await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `${window.location.origin}/callback`,
        scope: [],
      });

      setIsLoading(false);
    } catch {
      setIsLoading(false);
      return toast({
        title: 'Something went wrong.',
        description: 'Your log in request failed. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Button
      onClick={() => loginWithGoogle()}
      type="button"
      disabled={isLoading}
      size="lg"
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BsGoogle className="mr-2 h-4 w-4" />
      )}{' '}
      Continue with Google
    </Button>
  );
}
