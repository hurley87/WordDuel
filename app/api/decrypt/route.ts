import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { ciphertext } = (await req.json()) as {
      ciphertext: string;
    };
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY as string);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return new NextResponse(JSON.stringify({ decryptedText }));
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }));
  }
}
