import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageGenerationVariationDto, OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import { ProsConsDiscusserDto } from './dtos/pros-cons-discussers.dto';
import { response, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { AudioFileValidationPipe } from './pipes/validationaudio.pipe';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0]?.delta.content || '';

      res.write(piece);
    }
    res.end();
  }

  @Post('translate')
  async translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const { speechFile, prompt, selectedVoice } =
      await this.gptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(speechFile);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudioFile(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }
  

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${ new Date().getTime() }.${ fileExtension }`;
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @Body() audioToTextDto: AudioToTextDto,
    @UploadedFile(
      new AudioFileValidationPipe()
    ) file: Express.Multer.File,
  ) {
    
    
    return this.gptService.audioToText(file, audioToTextDto)
  }

  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto:ImageGenerationDto
  ){
    return await this.gptService.imageGeneration(imageGenerationDto)
  }

  @Get('image-generation/:fileName')
  async imageGenerationFile(
    @Param('fileName') fileName: string,
    @Res() res: Response
  ){
    
    const imagePath =  this.gptService.imageGenerationFile(fileName)
    // res.setHeader('Content-Type', '');
    res.status(HttpStatus.OK);
    res.sendFile(imagePath);
  }

   @Post('image-generation-variation')
  async imageVariation(
    @Body() imageGenerationVariationDto:ImageGenerationVariationDto
  ){
    return await this.gptService.imageGenerationVariation(imageGenerationVariationDto)
  }
}
