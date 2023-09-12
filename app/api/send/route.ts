import { EmailTemplate } from '@/components/email-template';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const apiKey = process.env.RESEND_API_KEY as string;

const resend = new Resend(apiKey);

export async function POST(req: Request) {
  try {
    const { email, subject, content } = (await req.json()) as {
      email: string;
      subject: string;
      content: string;
    };
    await resend.emails.send({
      from: 'WordDuel <dh@wordduel.xyz>',
      to: [email],
      subject,
      react: EmailTemplate({ content }),
      text: content,
    });

    return new NextResponse(JSON.stringify({ success: true }));
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }));
  }
}
