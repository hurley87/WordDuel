import { createClient } from '@supabase/supabase-js';

export const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createResult(result: any) {
  await client.from('results').insert([result]);
}

export async function getResults() {
  const { data } = await client.from('results').select('*');
  return data;
}
