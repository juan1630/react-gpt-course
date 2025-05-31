import { Injectable } from '@nestjs/common';
import {
  orthographyCheck,
  prosConsDiscusserUseCase,
  prosConsDiscusserStreamUseCase,
  translateUseCase
} from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
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

  async translate({prompt, lang} : TranslateDto ){
    return await translateUseCase(this.openia, {prompt, lang})
  }
}
