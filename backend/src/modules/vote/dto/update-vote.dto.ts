import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateVoteDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  option_id?: number;
}
