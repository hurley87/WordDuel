'use client';

import { toast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Icons } from './icons';
import { useContext, useState } from 'react';
import { UserContext } from '@/lib/UserContext';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export const DuelSendInvitation = ({ duel }: { duel: any }) => {
  const [user, _]: any = useContext(UserContext);
  const defaultContent = `You have been challenged to a duel by ${user.email}. \n\n Accept the duel here: ${window.location.origin}/duel/${duel.id}`;
  const [content, setContent] = useState<string>(defaultContent);
  const defaultSubject = `You were just challenged to a duel!`;
  const [subject, setSubject] = useState<string>(defaultSubject);
  const [isSending, setIsSending] = useState<boolean>(false);

  async function sendInvitation() {
    setIsSending(true);

    const res = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: duel.email,
        subject,
        content,
      }),
    });
    const data = await res.json();
    console.log(data);
    toast({
      title: 'Invitation sent!',
      description: 'Your opponent will receive an email shortly.',
    });
    setIsSending(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Duel Invitation</CardTitle>
        <CardDescription>
          Send an email to {duel.email} with the duel invitation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            disabled={isSending}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            disabled={isSending}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isSending}
          onClick={sendInvitation}
          className="w-full"
        >
          {isSending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Send Email to {duel.email}
        </Button>
      </CardFooter>
    </Card>
  );
};
