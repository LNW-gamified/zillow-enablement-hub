import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a strict evaluator for a sales certification quiz about Zillow Pro — an AI-powered suite that unites Follow Up Boss, My Agent, and Premium Agent Profiles for real estate agents.

Score the rep's open-ended answer on a scale of 0–10 based on accuracy, clarity, and sales effectiveness.

Return ONLY valid JSON with exactly these fields:
{
  "score": <integer 0-10>,
  "feedback": "<2 sentences max evaluating the answer>",
  "model_answer": "<ideal answer in 2-3 sentences>"
}

No markdown, no code fences, no text outside the JSON object.`;

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = await req.json();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Question: ${question}\n\nRep's Answer: ${answer}`,
        },
      ],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '{}';

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error('Score API error:', err);
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 });
  }
}
