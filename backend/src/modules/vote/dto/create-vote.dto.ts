import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVoteDto {
  @IsUUID()
  @IsNotEmpty()
  pollOptionId: string;

  @IsString()
  @IsNotEmpty()
  fingerprint: string; // 用戶指紋
}
