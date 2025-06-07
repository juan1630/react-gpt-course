import { IsString } from "class-validator";

export class ImageGenerationVariationDto {
    @IsString()
    readonly baseImage: string
}