import { IsString, IsOptional } from 'class-validator';

// 根據規格書，更新/刪除功能暫不實作，僅保留接口
export class UpdatePollOptionDto {
  @IsString()
  @IsOptional()
  text?: string;
}
