// Poll Repository
// 實作 Poll 的資料存取邏輯
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../../../entities/poll.entity';
import { PollRepositoryInterface } from './poll-repository.interface';

@Injectable()
export class PollRepository implements PollRepositoryInterface {
  constructor(
    @InjectRepository(Poll)
    private readonly repo: Repository<Poll>
  ) {}

  async findAll(): Promise<Poll[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Poll | null> {
    return this.repo.findOneBy({ id }) ?? null;
  }

  async create(poll: Partial<Poll>): Promise<Poll> {
    const entity = this.repo.create(poll);
    return this.repo.save(entity);
  }

  async update(id: number, poll: Partial<Poll>): Promise<Poll> {
    await this.repo.update(id, poll);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

// [備註]
// 目前這樣的 Repository 實作在單體應用、簡單 CRUD 下沒問題。
// 但未來遇到以下情境會有瓶頸：
// 1. 複雜查詢（多表 join、聚合、分頁、條件組合）會讓 repository 變肥大且難維護。
// 2. 若要支援多資料來源（如 CQRS, Event Sourcing, NoSQL），interface 需大幅調整。
// 3. 若要加快查詢效能，常需引入快取層（如 Redis），這時 repository 需額外包裝。
// 4. 若要支援分散式架構（微服務），repository pattern 會與 service boundary 產生衝突。
// 5. 若要做單元測試，需小心 mock repository 的行為與資料一致性。
// 建議未來如遇上述需求，考慮分層更細、引入查詢物件(Query Object)、或重構為更彈性的架構。
