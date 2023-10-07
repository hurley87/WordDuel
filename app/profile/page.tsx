import Logout from '@/components/logout';
import ProfileAccounts from '@/components/profile-accounts';
import { TransferForm } from '@/components/transfer-form';

export const metadata = {
  title: 'Transfer ETH',
  description: 'Transfer ETH to another wallet.',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto pt-11">
      <ProfileAccounts />
      <TransferForm />
      <Logout />
    </div>
  );
}
