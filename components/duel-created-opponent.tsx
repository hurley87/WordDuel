export const DuelCreatedOpponent = ({ duel }: { duel: any }) => {
  return (
    <div className="flex flex-col gap-3 md:justify-between w-full">
      accept duel {duel.email}. waiting on you to approve.
    </div>
  );
};
