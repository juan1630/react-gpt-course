import openAI from 'openai'

interface Options {
    prompt: string
    lang: string
}

export const translateUseCase = async(openia: openAI, { lang, prompt }:Options) =>{
    console.log({lang, prompt})
    const resp = await openia.chat.completions.create({
        messages:[
            {role:'system', content: `Traduce el siguiente texto al idioma ${lang}:${ prompt }`}],
        model:'gpt-3.5-turbo',
        temperature: 0.8,
        max_completion_tokens: 500
    })

    return {
        message: resp.choices[0].message.content
    }
}
