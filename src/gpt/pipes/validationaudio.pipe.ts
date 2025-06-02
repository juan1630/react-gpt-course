import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class AudioFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
 
    const allowedMimeTypes = [
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
      'audio/x-wav',
      'audio/aac',
      'audio/ogg',
      'audio/webm',
    ];
 
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported audio format: ${file.mimetype}`,
      );
    }
 
    const maxSizeInBytes = 5 * 1024 * 1024;
 
    if (file.size > maxSizeInBytes) {
      throw new BadRequestException('File is bigger than 5MB');
    }
 
    return file;
  }
}