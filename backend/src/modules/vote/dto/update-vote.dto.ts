import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVoteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  optionIds?: string[];
}
