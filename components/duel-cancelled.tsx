import { Container } from './container';
import { Button } from './ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import Link from 'next/link';

export const DuelCancelled = () => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-2">
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Duel Cancelled</CardTitle>
            <CardDescription>
              This duel was cancelled. You can create a new duel below.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/new" className="w-full">
              <Button className="w-full">New Duel</Button>
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};
