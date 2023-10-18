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
    <Card className="w-full">
      <CardHeader>
        <CardDescription>Or share this link.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          variant="outline"
          onClick={handleCopyLinkToClipboard}
          className="w-full"
        >
          Copy Link
        </Button>
      </CardFooter>
    </Card>
  );
};
