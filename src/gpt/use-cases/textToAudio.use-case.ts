import OpenAI from "openai"
import * as path from "path"
import * as fs from 'fs'

interface Options {
    voice: string
    prompt: string
}
export const TextToAudioUseCase = async(openia:OpenAI, { voice, prompt }:Options) => {

    const voices = {
        'nova':'nova',
        'alloy':'alloy',
        'onyx':'onyx',
        'fable':'fable',
        'ash':'ash',
        'verse':'verse'
    }

    const selectedVoice = voices[voice] ?? 'nova'

    const folderPath = path.resolve(__dirname,'../../../generated/audios/')
    const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`)
    await fs.mkdirSync(folderPath , { recursive:true })

    const mp3 = await openia.audio.speech.create({
        model:'tts-1-hd',
        voice:selectedVoice,
        input: prompt,
        response_format:'mp3'
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    fs.writeFileSync(speechFile, buffer)

    return {
        prompt,
        selectedVoice,
        speechFile
    } 
}