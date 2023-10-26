'use client';

import useFCM from '@/hooks/useFCM';
import Link from 'next/link';
import { Icons } from './icons';

export default function Notifications() {
  const { messages } = useFCM();

  return (
    <div>
      {messages.map((message) => {
        return (
          <Link
            href={`/${message?.data?.duelType}/${message?.data?.duelId}`}
            className="w-full"
          >
            <div className="flex justify-between rounded-none px-2 py-4 transition-all border-b border-accent hover:bg-accent hover:text-accent-foreground w-full">
              <p className="font-medium text-sm">
                {message?.notification?.title} : {message?.notification?.body}
              </p>
              <p className="font-bold flex flex-col items-center">
                <Icons.chevronRight />
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
