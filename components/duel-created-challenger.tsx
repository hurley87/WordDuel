import { DuelCancel } from './duel-cancel';
import { Container } from './container';
import { DuelCopyLink } from './duel-copy-link';

export const DuelCreatedChallenger = ({ duel }: { duel: any }) => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto py-20">
      <Container>
        <DuelCopyLink duelId={duel?.id} path="duel" />
      </Container>
      <Container>
        <DuelCancel duelId={duel?.id} />
      </Container>
    </div>
  );
};
