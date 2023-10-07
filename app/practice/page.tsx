import { PracticeDuelCreate } from '@/components/practice-duel-create';

export const metadata = {
  title: 'Create a New Free Duel',
  description: 'Create a duel and invite your friend.',
};

export default function PracticeDuelPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-4 max-w-sm py-20">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Create a practice duel where you and an opponent take turns guessing a
          5-letter word. {"You'll"} guess first and whoever guesses the correct
          word first wins.
        </p>
      </div>
      <PracticeDuelCreate />
    </div>
  );
}
