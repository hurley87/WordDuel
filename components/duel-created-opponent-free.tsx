import { useContext, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { useFreeWrite } from '@/hooks/useFreeWrite';
import { Icons } from './icons';
import { Container } from './container';
import { useFreeSubscribe } from '@/hooks/useFreeSubscribe';
import { toast } from './ui/use-toast';
import { getaloRequest } from '@/lib/gelato';
import va from '@vercel/analytics';
import { UserContext } from '@/lib/UserContext';

export const DuelCreatedOpponentFree = ({ duel }: { duel: any }) => {
  const contract = useFreeWrite();
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [user, _]: any = useContext(UserContext);

  useFreeSubscribe({
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
      const data = await contract?.populateTransaction.acceptDuel(
        duel.id.toString()
      );
      await getaloRequest(data?.data);
      va.track('AcceptPractice', {
        address: user?.publicAddress,
      });
    } catch (e) {
      const description = e?.message || e;
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
              {"You've"} been challenged to a word duel. Accept the duel to play
              for free and earn bragging rights.
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
              Accept Duel
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};
