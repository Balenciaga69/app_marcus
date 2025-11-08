import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreatePollOptionDto {
  @IsString()
  @IsNotEmpty()
  pollId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  texts: string[];
}
