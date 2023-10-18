import { DuelCancel } from './duel-cancel';
import { DuelCopyLink } from './duel-copy-link';
import { DuelTwitterShare } from './duel-twitter-share';

export const DuelCreatedChallenger = ({ duel }: { duel: any }) => {
  return (
    <div className="flex flex-col gap-0 max-w-lg mx-auto">
      <DuelCopyLink duelId={duel?.id} path="duel" />
      <DuelTwitterShare duelId={duel?.id} path="duel" />
      <DuelCancel duelId={duel?.id} />
    </div>
  );
};
