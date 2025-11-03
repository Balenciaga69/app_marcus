import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateVoteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  optionId?: string;

  @IsString()
  @IsOptional()
  fingerprint?: string;
}
