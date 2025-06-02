import OpenAI from 'openai';
import * as fs from 'fs'

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const AudioToTextUseCase = async(openai: OpenAI, { prompt, audioFile }:Options) => {

    const trancription = await openai.audio.transcriptions.create({
        model:'whisper-1',
        file:fs.createReadStream(audioFile.path),
        prompt,
        language:  'es',
        response_format: 'verbose_json'
    })

    return trancription
};
