'use client';

import { client, getResults } from '@/lib/db';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function Results() {
  const { data: queryResults } = useQuery({
    queryKey: ['results'],
    queryFn: getResults,
  });
  const [results, setResults] = useState(queryResults);
  console.log(results);

  useEffect(() => {
    setResults(queryResults);
    const channel = client
      .channel('pinned-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload) => {
          const newPayload = payload?.new;
          console.log(newPayload);
          const updatedPayload = [...(queryResults || []), newPayload];
          console.log(updatedPayload);
          setResults(updatedPayload);
        }
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, [queryResults]);

  const ties = results?.filter((r) => r.result === 'tie').length;
  const wins = results?.filter((r) => r.result === 'win').length;
  const losses = results?.filter((r) => r.result === 'loss').length;
  return (
    <div className="flex justify-between text-xs">
      <p>Humans: {wins}</p>
      <p>Draws: {ties}</p>
      <p>ChatGPT: {losses}</p>
    </div>
  );
}

export default Results;
