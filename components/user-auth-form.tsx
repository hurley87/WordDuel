'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { userAuthSchema } from '@/lib/validations/auth';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { magic } from '@/lib/magic';
import { useRouter } from 'next/navigation';

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const email = data.email.toLowerCase();

      await magic.auth.loginWithEmailOTP({
        email,
      });
      router.push('/');
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...register('email')}
          />
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <Button variant="secondary" size="lg">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Log In
        </Button>
      </div>
    </form>
  );
}
