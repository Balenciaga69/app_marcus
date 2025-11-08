import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateVoteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
