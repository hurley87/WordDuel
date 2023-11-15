import { NextResponse } from 'next/server';

import { words } from '@/lib/wordle';
import CryptoJS from 'crypto-js';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const randomWord = words[Math.floor(Math.random() * words.length)];

    const ciphertext = CryptoJS.AES.encrypt(
      randomWord,
      process.env.SECRET_KEY as string
    ).toString();

    return new NextResponse(JSON.stringify({ ciphertext }));
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }));
  }
}
