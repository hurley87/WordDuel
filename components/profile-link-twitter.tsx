'use client';

import { Card, CardDescription, CardFooter, CardHeader } from './ui/card';
import { Button } from '@/components/ui/button';
import { CardContent } from './ui/card';
import { usePrivy } from '@privy-io/react-auth';

function ProfileLinkTwitter() {
  const { user, linkTwitter, unlinkTwitter } = usePrivy();

  function linkOrUnlinkTwitter() {
    !!user?.twitter ? unlinkTwitter(user.twitter.subject) : linkTwitter();
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          <p>Twitter</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs">
          {!!user?.twitter
            ? `Connected @${user.twitter.username}`
            : 'Not connected'}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={linkOrUnlinkTwitter}
          className="w-full"
          variant="outline"
        >
          {!!user?.twitter ? 'Unlink Twitter' : 'Link Twitter'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileLinkTwitter;
