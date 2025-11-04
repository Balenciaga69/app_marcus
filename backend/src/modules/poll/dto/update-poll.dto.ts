import { IsString, IsOptional } from 'class-validator';

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
