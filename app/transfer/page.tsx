import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { TransferForm } from '@/components/transfer-form';

export const metadata = {
  title: 'Transfer ETH',
  description: 'Transfer ETH to another wallet.',
};

export default function NewDuelPage() {
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
            Transfer ETH to another wallet.
          </p>
        </div>
        <TransferForm />
      </div>
    </div>
  );
}
