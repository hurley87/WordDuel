import { Magic } from '@magic-sdk/admin';
import { NextResponse } from 'next/server';

// Create an instance of magic admin using our secret key (not our publishable key)
let mAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Grab the DID token from our headers and parse it
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }
    const didToken = mAdmin.utils.parseAuthorizationHeader(authHeader);

    // Validate the token and send back a successful response
    await mAdmin.token.validate(didToken);

    return new NextResponse(JSON.stringify({ authenticated: true }));
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: error.message }));
  }
}
