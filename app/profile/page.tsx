'use client';

import GetStarted from '@/components/get-started';
import Logout from '@/components/logout';
import ProfileAccounts from '@/components/profile-accounts';
import ProfileActiveWallet from '@/components/profile-active-wallet';
import ProfileLinkTwitter from '@/components/profile-link-twitter';
import { TransferForm } from '@/components/transfer-form';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = usePrivy();
  return (
    <div className="flex flex-col max-w-md mx-auto pt-11 overflow-y-auto h-screen pb-48 md:pb-0">
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full">
        <div className="w-full p-2 bg-slate-800">
          {user ? (
            <Link className="w-full" href="/">
              <Button className="w-full" size="lg">
                Play WordDuel
              </Button>
            </Link>
          ) : (
            <GetStarted />
          )}
        </div>
      </div>
      <ProfileLinkTwitter />
      <ProfileActiveWallet />
      <ProfileAccounts />
      <TransferForm />
      <Logout />
      <div className="h-10 p-10"></div>
    </div>
  );
}
