import { Card, CardDescription, CardHeader } from './ui/card';

export default function NotInvited({ duel }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          You must have access to {duel.email} to accept this duel.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
