'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { userAuthSchema } from '@/lib/validations/auth';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { magic } from '@/lib/magic';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/lib/UserContext';
import { BsGoogle } from 'react-icons/bs';

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthGoogle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [_, setUser]: any = useContext(UserContext);
  const [redirect, setRedirect] = useState<string>('/');

  useEffect(() => {
    // get the r param from the url
    const urlParams = new URLSearchParams(window.location.search);

    // if the r param is present, set it in local storage
    if (urlParams.get('r')) {
      setRedirect(`/duel/${urlParams.get('r')}`);
    }
  }, []);

  async function loginWithGoogle() {
    setIsLoading(true);

    try {
      // Log in using our email with Magic and store the returned DID token in a variable
      await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `${window.location.origin}/callback`,
        scope: [] /* optional */,
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
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Button
        onClick={() => loginWithGoogle()}
        variant="outline"
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
    </>
  );
}
