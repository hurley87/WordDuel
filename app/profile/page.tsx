'use client';

import GetStarted from '@/components/get-started';
import Layout from '@/components/layout';
import Logout from '@/components/logout';
import ProfileAccounts from '@/components/profile-accounts';
import ProfileActiveWallet from '@/components/profile-active-wallet';
import ProfileLinkTwitter from '@/components/profile-link-twitter';
import { TransferForm } from '@/components/transfer-form';

export default function ProfilePage() {
  return (
    <Layout title="Profile">
      <ProfileLinkTwitter />
      <ProfileActiveWallet />
      <ProfileAccounts />
      <TransferForm />
      <Logout />
    </Layout>
  );
}
