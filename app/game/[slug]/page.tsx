'use client';

import Loading from '@/components/loading';
import { useQuery } from '@tanstack/react-query';
import { getDuel } from '@/lib/db';
import WordDuelGamePlay from '@/components/wordduel-gameplay';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

export default function Page({ params }: { params: { slug: string } }) {
  const duelId = parseInt(params.slug);
  const { data: duel, isLoading } = useQuery({
    queryKey: ['duel', duelId],
    queryFn: () => getDuel(duelId),
  });

  if (isLoading) return <Loading />;

  if (duel)
    return (
      <>
        <Link href="/" className="absolute left-4 top-4">
          <Badge className="flex flex-rox">
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            <p>Back</p>
          </Badge>
        </Link>
        {duel && <WordDuelGamePlay duel={duel} />}
      </>
    );

  return <div>no duel</div>;
}
