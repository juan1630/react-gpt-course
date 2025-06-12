import OpenAI from "openai";

interface Options {
    assitanceId?: string
    threadId: string
}

export const createRunUseCase = async (openia: OpenAI,  options: Options ) => {

    const { threadId, assitanceId ='asst_2g1O8TjFDm38hWp1XOfCEYZo' } = options
    const run = await openia.beta.threads.runs.create(threadId, {
        assistant_id: assitanceId,
        // instructions Sobre escribe el asistente
    })

    return run
}