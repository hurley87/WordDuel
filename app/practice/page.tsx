import { PracticeDuelForm } from '@/components/practice-duel-form';

export const metadata = {
  title: 'Create a New Free Duel',
  description: 'Create a duel and invite your friend.',
};

export default function PracticeDuelPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Invite your {`opponent`} by email. Only the owner of this email can
          accept the duel.
        </p>
      </div>
      <PracticeDuelForm />
    </div>
  );
}
