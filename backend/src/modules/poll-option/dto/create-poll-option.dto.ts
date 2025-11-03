import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePollOptionDto {
  @IsString()
  @IsNotEmpty()
  pollId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
