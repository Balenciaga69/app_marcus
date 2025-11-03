import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  pollId: string;

  @IsString()
  @IsNotEmpty()
  optionId: string;

  @IsString()
  @IsNotEmpty()
  fingerprint: string;
}
