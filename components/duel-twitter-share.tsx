'use client';

import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';

export const DuelTwitterShare = ({
  duelId,
  path,
}: {
  duelId: string;
  path: string;
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription>Find someone on X.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          variant="outline"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURI(
                `${window.location.origin}/${path}/${duelId}`
              )}&text=Play%20me%20in%20WordDuel%3A`,
              '_blank'
            )
          }
          className="w-full"
        >
          Share on X
        </Button>
      </CardFooter>
    </Card>
  );
};
