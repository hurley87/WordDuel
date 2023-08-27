import { useContext, useState } from 'react';
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
import { parseEther } from 'viem';

export const DuelCreatedOpponent = ({ duel }: { duel: any }) => {
  const { writeAsync: acceptDuel } = useWrite({
    functionName: 'acceptDuel',
  });
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const amount = Number(duel.moveAmount) / 10 ** 18;

  async function handleCancellation() {
    setIsAccepting(true);
    console.log(amount.toString());
    console.log(duel.id.toString());
    try {
      await acceptDuel?.({
        args: [duel.id.toString()],
        value: parseEther(amount.toString()),
      });
    } catch (e) {
      console.log(e);
    }

    setIsAccepting(false);
  }

  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-2">
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Accept Duel</CardTitle>
            <CardDescription>
              For every guess you make {`you'll`} have to add {amount} ETH to
              the pot. The person who guesses the right word wins the duel and
              all the ETH in the pot.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              disabled={isAccepting}
              onClick={handleCancellation}
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
