import * as fs from 'fs';
import openia from 'openai';
import { downloadImageAsPng } from '../../../helpers/';

interface Options {
  baseImage: string;
}
export const imageVariationUseCase = async (
  openIa: openia,
  { baseImage }: Options,
) => {
  const pngImagePath = await downloadImageAsPng(baseImage, true);

  const response = await openIa.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath!),
    size: '1024x1024',
    n: 1,
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
