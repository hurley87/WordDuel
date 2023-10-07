import { Container } from './container';
import { Card, CardDescription, CardHeader } from './ui/card';

export const DuelCancelled = () => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto py-20">
      <Container>
        <Card>
          <CardHeader>
            <CardDescription>This duel has been cancelled.</CardDescription>
          </CardHeader>
        </Card>
      </Container>
    </div>
  );
};
