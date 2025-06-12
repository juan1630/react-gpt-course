import OpenAI from "openai"

interface Options {
    threadId: string
}

export const getMessagesUseCase = async (openia: OpenAI,  options: Options) => {
    
    const messagesList = await openia.beta.threads.messages.list(options.threadId)

    const messages = messagesList.data.map( message => ({
        role: message.role,
        content: message.content.map(content => (content as any).text.value)
    }))

    return messages
}