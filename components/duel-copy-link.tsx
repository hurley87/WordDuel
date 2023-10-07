'use client';

import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { toast } from './ui/use-toast';

export const DuelCopyLink = ({
  duelId,
  path,
}: {
  duelId: string;
  path: string;
}) => {
  const description = `${window.location.origin}/${path}/${duelId}`;
  async function handleCopyLinkToClipboard() {
    await navigator.clipboard.writeText(description);
    toast({
      title: 'Link copied to clipboard',
      description,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {"You're"} waiting on an opponent to accept your duel. Invite someone
          using this link: {`\n${description}`}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleCopyLinkToClipboard} className="w-full">
          Copy Link
        </Button>
      </CardFooter>
    </Card>
  );
};
