import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  pollId: string;

  @IsString()
  optionId: string;

  @IsString()
  @IsNotEmpty()
  fingerprint: string;
}
