/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Delete } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Delete('drop-all')
  /**
   * 刪除 PostgreSQL 'public' schema 中的所有資料表。
   *
   * 此方法會取得 'public' schema 下所有資料表名稱，並使用 `DROP TABLE ... CASCADE` 指令移除。
   * 執行期間會暫時將 session replication role 設為 'replica'，以略過外鍵約束，完成後再恢復預設值。
   *
   * @returns 回傳一個物件，包含執行狀態與被刪除的資料表名稱列表。
   *
   * @warning
   * 此操作非常危險，會不可逆地刪除 'public' schema 中的所有資料與結構。
   * 請務必謹慎使用，尤其是在正式環境。執行前請確保已備份所有重要資料。
   */
  async dropAllTables() {
    const tables = await this.dataSource.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
    await this.dataSource.query('SET session_replication_role = replica;');
    for (const { tablename } of tables) {
      await this.dataSource.query(`DROP TABLE IF EXISTS "${tablename}" CASCADE;`);
    }
    await this.dataSource.query('SET session_replication_role = DEFAULT;');
    return { status: 'dropped', tables: tables.map((t) => t.tablename) };
  }
}
