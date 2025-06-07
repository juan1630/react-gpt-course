import * as fs from 'fs';

import { downloadBase64ImageAsPng, downloadImageAsPng } from 'helpers';
import openai from 'openai';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}
export const ImageGenerationUseCase = async (
  openAi: openai,
  { prompt, maskImage, originalImage }: Options,
) => {
  // todo: verificar original image
  if (!originalImage || !maskImage) {
    const response = await openAi.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await downloadImageAsPng(response!.data![0]!.url!);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
    return {
      // TODO: Retornar la imagen con el https:
      url,
      openiaUrl: response.data![0]!.url,
      revised_prompt: response!.data![0].revised_prompt,
    };
  }

  //   Es una url
  // maskImage=Base64;kjrerkberhbher
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskImagePath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openAi.images.edit({
    model: 'dall-e-3',
    prompt,
    image: fs.createReadStream(pngImagePath!),
    mask: fs.createReadStream(maskImagePath!) || '',
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPng(response!.data![0]!.url!);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openiaUrl: response.data![0]!.url,
    revised_prompt: response!.data![0].revised_prompt,
  };
};
