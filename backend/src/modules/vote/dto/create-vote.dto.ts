import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  pollId: string;

  @IsArray()
  @IsString({ each: true })
  optionIds: string[];

  @IsString()
  @IsNotEmpty()
  fingerprint: string;
}
