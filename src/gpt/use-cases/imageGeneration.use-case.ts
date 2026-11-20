import openai from 'openai';
import { getImageFromBucket, storeImage } from '../helpers/images/storeImage'

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}


export const ImageGenerationUseCase = async (
  openAi: openai,
  { prompt, maskImage, originalImage }: Options,
) => {
  if (!originalImage || !maskImage) {
    const response = (await openAi.images.generate({
      prompt,
      model: 'gpt-image-2.5-flare',
      n: 1,
      size: '1024x1024',
    })) as any;

    const imageString = response.data![0]?.b64_json!;
    const image = Buffer.from(imageString, 'base64');

    const isStored = await storeImage(image,  response.data[0].generation_id! );
    if (!isStored) {
      return 'No se pudo guardar';
    }

    const imageUrl = await getImageFromBucket( response.data[0].generation_id! );
    if (!imageUrl.includes('Error')) {
      return {
        url: imageUrl,
        revised_prompt: response!.data![0].revised_prompt,
      };
    }

    return {
      error: 'Hubo problema',
    };
  }

  //   Es una url
  // maskImage=Base64;kjrerkberhbher

  // try {
  //   const pngImagePath = await downloadImageAsPng(originalImage, true);
  //   const maskImagePath = await downloadBase64ImageAsPng(maskImage, true);

  //   const response = await openAi.images.edit({
  //     model: 'dall-e-2',
  //     prompt,
  //     image: await toFile(fs.createReadStream(pngImagePath!), null, {
  //       type: 'image/png',
  //     }),
  //     mask: await toFile(fs.createReadStream(maskImagePath!), null, {
  //       type: 'image/png',
  //     }),
  //     n: 1,
  //     size: '1024x1024',
  //     response_format: 'url',
  //   });

  //   const fileName = await downloadImageAsPng(response!.data![0]!.url!);
  //   const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  //   return {
  //     url,
  //     openiaUrl: response.data![0]!.url,
  //     revised_prompt: response!.data![0].revised_prompt,
  //   };
  // } catch (error) {
  //   console.error(error);
  // }
};
