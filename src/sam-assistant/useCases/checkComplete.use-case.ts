import OpenAI from "openai";

interface Options {
    threadId: string
    runId: string
}

export const checkStatusUseCase = async(openia: OpenAI, options: Options) => {
    const { runId, threadId } = options
    const runStatus  = await openia.beta.threads.runs.retrieve(runId, 
        {thread_id: threadId}
    )

    if( runStatus.status == 'completed' ){
        return runStatus
    }

    await new Promise(resolve => setTimeout(resolve, 2000)) //sleep
    return await checkStatusUseCase(openia, options)
}