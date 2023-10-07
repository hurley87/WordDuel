import { Container } from './container';
import { DuelCancelFree } from './duel-cancel-free';
import { DuelCopyLink } from './duel-copy-link';

export const DuelCreatedChallengerFree = ({ duel }: { duel: any }) => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto py-20">
      <Container>
        <DuelCopyLink duelId={duel?.id} path="practice" />
      </Container>
      <Container>
        <DuelCancelFree duelId={duel?.id} />
      </Container>
    </div>
  );
};
