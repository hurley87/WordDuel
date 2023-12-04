import { createClient } from '@supabase/supabase-js';

export const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createResult(result: any) {
  await client.from('results').insert([result]);
}

export function createDuel(duel: any) {
  return client.from('games').insert([duel]);
}

export async function getResults() {
  const { data } = await client.from('results').select('*');
  return data;
}

export async function getDuels() {
  const { data } = await client.from('games').select('*');
  return data;
}

export async function getDuel(id: number) {
  const { data } = await client
    .from('games')
    .select()
    .eq('id', id)
    .maybeSingle();
  return data;
}

export async function getUserDuels(address: string) {
  const { data } = await client
    .from('games')
    .select('*')
    .eq('address', address);
  return data;
}

export async function updateDuel(duel: any) {
  const { data } = await client.from('games').update(duel).eq('id', duel.id);
  return data;
}
