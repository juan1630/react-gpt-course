import OpenAI from "openai";

export const createThreadUseCase = async (openia: OpenAI) => {
 const {id} =  await openia.beta.threads.create()
 return {id}
}