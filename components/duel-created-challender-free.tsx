import { DuelCancelFree } from './duel-cancel-free';
import { DuelCopyLink } from './duel-copy-link';
import { DuelTwitterShare } from './duel-twitter-share';

export const DuelCreatedChallengerFree = ({ duel }: { duel: any }) => {
  return (
    <div className="flex flex-col gap-0 max-w-md mx-auto">
      <DuelTwitterShare duelId={duel?.id} path="practice" />
      <DuelCopyLink duelId={duel?.id} path="practice" />
      <DuelCancelFree duelId={duel?.id} />
    </div>
  );
};
