import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePollOptionDto {
  @IsNumber()
  @IsNotEmpty()
  pollId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
