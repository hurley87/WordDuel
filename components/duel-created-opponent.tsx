import { useState } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useWrite } from '@/hooks/useWrite';
import { Icons } from './icons';
import { Container } from './container';
import { useSubscribe } from '@/hooks/useSubscribe';
import { toast } from './ui/use-toast';

export const DuelCreatedOpponent = ({ duel }: { duel: any }) => {
  const { writeAsync: acceptDuel } = useWrite({
    functionName: 'acceptDuel',
  });
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const amount = (Number(duel.moveAmount) / 10 ** 18).toString();

  useSubscribe({
    eventName: 'DuelAccepted',
    listener(logs: any) {
      const duelId = logs[0]?.args?.id?.toString();
      if (duelId) {
        setIsAccepting(false);
        return toast({
          title: 'Duel Accepted',
          description: 'Good luck!',
        });
      }
    },
  });

  async function handleAcceptDuel() {
    setIsAccepting(true);

    try {
      await acceptDuel?.({
        args: [duel?.id.toString()],
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
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-2">
      <Container>
        <Card>
          <CardHeader>
            <CardDescription>
              For each guess you make {`you'll`} add {amount} ETH to the pot.
              The person who guesses the right word first wins the entire pot.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              disabled={isAccepting}
              onClick={handleAcceptDuel}
              className="w-full"
              size="lg"
            >
              {isAccepting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Accept Duel ({amount} ETH)
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};
