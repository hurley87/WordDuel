import { Card, CardDescription, CardHeader } from './ui/card';

export const DuelCancelled = () => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto">
      <div className="'flex items-center justify-center [&>div]:w-full">
        <Card>
          <CardHeader>
            <CardDescription>This game has been cancelled.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
