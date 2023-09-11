import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';
import { words } from '@/lib/wordle';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const randomWord = words[Math.floor(Math.random() * words.length)];

    console.log('Random word:', randomWord);

    const ciphertext = CryptoJS.AES.encrypt(
      randomWord,
      process.env.SECRET_KEY
    ).toString();

    console.log('Ciphertext:', ciphertext);

    return new NextResponse(JSON.stringify({ ciphertext }));
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ hello: 'world' }));
  }
}
