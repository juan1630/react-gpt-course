import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  orthographyCheck,
  prosConsDiscusserUseCase,
  prosConsDiscusserStreamUseCase,
  translateUseCase,
  TextToAudioUseCase,
  AudioToTextUseCase,
  ImageGenerationUseCase,
  imageVariationUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
  ImageGenerationDto,
  ImageGenerationVariationDto,
} from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  private openia = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // solo va llamar casos de uso

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheck(this.openia, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openia, { prompt });
  }

  async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openia, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openia, { prompt, lang });
  }

  async textToAudio(options: TextToAudioDto) {
    return await TextToAudioUseCase(this.openia, options);
  }

  async textToAudioFile(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);
    if (!wasFound) throw new NotFoundException('File was not found');
    return filePath;
  }

  async audioToText(audioFile: Express.Multer.File, prompt: AudioToTextDto) {
    return await AudioToTextUseCase(this.openia, {
      audioFile,
      prompt: prompt.prompt,
    });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await ImageGenerationUseCase(this.openia, { ...imageGenerationDto });
  }

   imageGenerationFile(fileName: string) {
    
    const imagePath = path.resolve('./', './generated/images/', fileName)
  
    const found = fs.existsSync(imagePath);
    if (!found) throw new NotFoundException('File not found');
    return imagePath
  }
  async imageGenerationVariation ({ baseImage }: ImageGenerationVariationDto) {
    return imageVariationUseCase(this.openia, {baseImage  })
  }
}
