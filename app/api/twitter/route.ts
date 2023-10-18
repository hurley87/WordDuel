import { NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { formatAddress } from '@/lib/utils';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { address } = (await req.json()) as {
      address: string;
    };

    const secret = process.env.PRIVY_SECRET as string;
    const id = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;

    const privy = new PrivyClient(id, secret);

    let username = formatAddress(address);
    const user = await privy.getUserByWalletAddress(address);
    if(!!user?.twitter) username = user.twitter.username as string;


    return new NextResponse(JSON.stringify({ username }));
  } catch (error) {
    console.log(error)
    return new NextResponse(JSON.stringify({ error }));
  }
}
