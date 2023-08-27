import { DuelCancel } from './duel-cancel';
import { DuelSendInvitation } from './duel-send-invitation';
import { Container } from './container';

export const DuelCreatedChallenger = ({ duel }: { duel: any }) => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto px-2">
      <Container>
        <DuelCancel duelId={duel.id} />
      </Container>
      <Container>
        <DuelSendInvitation duel={duel} />
      </Container>
    </div>
  );
};
