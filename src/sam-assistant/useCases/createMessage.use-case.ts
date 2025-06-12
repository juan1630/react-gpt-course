import OpenAI from 'openai';

interface Options {
  threadId: string;
  question: string;
}
export const createMessageUseCase = async (
  openai: OpenAI,
  { threadId, question }: Options,
) => {
  const messages = await openai.beta.threads.messages.create(threadId, {
    content: question,
    role: 'user',
  });

  return messages
};
