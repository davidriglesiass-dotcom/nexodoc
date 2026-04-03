// app/api/ai/chat/route.ts
import { buildSystemPrompt, PatientContext } from '@/lib/specialists';
import { ChatMessage } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { messages, specialistId, patientContext } = await req.json() as {
      messages: ChatMessage[];
      specialistId: string;
      patientContext: PatientContext;
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API key no configurada' }, { status: 503 });
    }

    const system = buildSystemPrompt(specialistId ?? 'dani', patientContext ?? { nombre: 'paciente' });

    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`));
            }
            if (event.type === 'message_stop') {
              controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
            }
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    console.error('AI route error:', msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
