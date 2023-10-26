import { NextResponse, NextRequest } from 'next/server';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeAdmin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { token, msg, data } = (await req.json()) as {
    token: string;
    msg: any;
    data: any;
  };

  try {
    await initializeAdmin();

    const message = {
      token,
      notification: {
        title: msg.title,
        body: msg.body,
      },
      data,
    };

    await getMessaging().send(message);
  } catch (e) {
    console.error('sendFCMMessage error', e);
  }

  return NextResponse.json({ message: 'success' });
}
