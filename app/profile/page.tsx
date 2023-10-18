import Logout from '@/components/logout';
import ProfileAccounts from '@/components/profile-accounts';
import ProfileActiveWallet from '@/components/profile-active-wallet';
import ProfileLinkTwitter from '@/components/profile-link-twitter';
import { TransferForm } from '@/components/transfer-form';

export const metadata = {
  title: 'Profile',
  description: 'Manage your WordDuel profile.',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col max-w-md mx-auto pt-11 overflow-y-auto h-screen pb-14 md:pb-0">
      <ProfileLinkTwitter />
      <ProfileActiveWallet />
      <ProfileAccounts />
      <TransferForm />
      <Logout />
    </div>
  );
}
