import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { Container } from './container';

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function GetStarted() {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-2 pt-20">
      <Container>
        <Card>
          <CardHeader>
            <CardDescription>
              Create an account before you get started.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link className="w-full" href={`/`}>
              <Button className="mx-auto w-full" size="lg">
                Get Started
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
