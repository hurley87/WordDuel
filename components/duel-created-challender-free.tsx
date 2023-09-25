import { DuelSendInvitation } from './duel-send-invitation';
import { Container } from './container';
import { DuelCancelFree } from './duel-cancel-free';

export const DuelCreatedChallengerFree = ({ duel }: { duel: any }) => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-2">
      <Container>
        <DuelCancelFree duelId={duel?.id} />
      </Container>
      <Container>
        <DuelSendInvitation duel={duel} route="practice" />
      </Container>
    </div>
  );
};
