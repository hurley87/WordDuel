import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { guessWord } = (await req.json()) as {
      guessWord: string;
    };

    const ciphertext = CryptoJS.AES.encrypt(
      guessWord,
      process.env.SECRET_KEY
    ).toString();

    return new NextResponse(JSON.stringify({ ciphertext }));
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ hello: 'world' }));
  }
}
