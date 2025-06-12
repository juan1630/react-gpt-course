import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadUseCase, createMessageUseCase, createRunUseCase, checkStatusUseCase, getMessagesUseCase } from './useCases'
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {

    private openia = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    async createThread () {
        return createThreadUseCase(this.openia)
    }

    async userQuestion ( questionDto: QuestionDto ) {
       const message = await createMessageUseCase(this.openia, { ...questionDto })
    
       const {id} = await createRunUseCase(this.openia, { threadId: questionDto.threadId })
    
       await checkStatusUseCase(this.openia, { threadId: questionDto.threadId, runId: id })
       
      const messages = await getMessagesUseCase(this.openia, {threadId: questionDto.threadId})

      return messages.reverse()
    }
}
