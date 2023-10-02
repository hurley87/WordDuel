import Logout from '@/components/logout';
import ProfileAccounts from '@/components/profile-accounts';
import { TransferForm } from '@/components/transfer-form';

export const metadata = {
  title: 'Transfer ETH',
  description: 'Transfer ETH to another wallet.',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 max-w-sm px-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Manage your accounts</p>
        </div>
        <ProfileAccounts />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 max-w-sm px-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Withdraw ETH to another wallet.
          </p>
        </div>
        <TransferForm />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-4 max-w-sm px-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Logout of your wallet.
          </p>
        </div>
        <Logout />
      </div>
    </div>
  );
}
