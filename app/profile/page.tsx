import Logout from '@/components/logout';
import ProfileAccounts from '@/components/profile-accounts';
import { TransferForm } from '@/components/transfer-form';

export const metadata = {
  title: 'Transfer ETH',
  description: 'Transfer ETH to another wallet.',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-2 max-w-md mx-auto pt-20">
      <ProfileAccounts />
      <TransferForm />
      <Logout />
    </div>
  );
}
