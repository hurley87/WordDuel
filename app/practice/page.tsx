'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Wordle from '@/components/wordle';

export default function PracticePage() {
  return (
    <div className="container w-screen flex-col">
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
      <div className="flex flex-col gap-2 max-w-lg mx-auto px-2 pt-28">
        <Wordle />
      </div>
    </div>
  );
}
