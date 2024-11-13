import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
//
export const runtime = 'edge';

export async function POST(req: Request) {
  const { links } = await req.json();

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const prompt = `
    You are a skilled content creator and writer. Your task is to create a cohesive blog post based on the following links:

    ${links.join('\n')}

    Analyze the content from these links and create a well-structured blog post that combines the information. 
    Pay attention to the writing style used in the source materials and try to emulate it in your generated post. 
    Ensure the post flows naturally and provides valuable insights to the reader. 
    Include relevant examples and maintain a consistent tone throughout the post.

    Your response should be in Markdown format, including appropriate headings, subheadings, and formatting.
  `;

  const result = await streamText({
    model: openrouter('meta-llama/llama-2-13b-chat'),
    prompt,
  });

  return result.toAIStreamResponse();
}