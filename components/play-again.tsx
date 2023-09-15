import { useContext, useState } from 'react';
import { Button } from './ui/button';
import { useWrite } from '@/hooks/useWrite';
import { Icons } from './icons';
import { useSubscribe } from '@/hooks/useSubscribe';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { generateWord } from '@/lib/wordle';
import { UserContext } from '@/lib/UserContext';

export const PlayAgain = ({ duel }: { duel: any }) => {
  const [user, _] = useContext(UserContext);
  const contract = useWrite();
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const router = useRouter();

  useSubscribe({
    eventName: 'DuelCreated',
    listener(logs: any) {
      const duelId = logs[0]?.args?.id?.toString();
      if (!duelId)
        return toast({
          title: 'There was a problem creating your duel.',
          description: 'Please try again.',
          variant: 'destructive',
        });
      router.push(`/duel/${duelId}`);
    },
  });

  async function handlePlayAgain() {
    setIsAccepting(true);

    const word = await generateWord();

    try {
      await contract?.createDuel(duel.email, word, {
        value: duel.moveAmount,
      });
    } catch (e) {
      const description = e?.data?.message || e?.message || e;
      return toast({
        title: 'There was a problem creating your duel.',
        description,
        variant: 'destructive',
      });
    }
  }

  return (
    <>
      <Button
        disabled={isAccepting}
        onClick={handlePlayAgain}
        className="w-full"
        size="lg"
      >
        {isAccepting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Play Again
      </Button>
    </>
  );
};
