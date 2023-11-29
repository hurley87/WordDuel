import { OpenAIStream } from '@/lib/gpt';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt } = (await req.json()) as {
      prompt: string;
    };
    const apiKey = process.env.OPENAI_API_KEY as string;
    const stream = await OpenAIStream(prompt, apiKey);

    return new Response(stream);
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
