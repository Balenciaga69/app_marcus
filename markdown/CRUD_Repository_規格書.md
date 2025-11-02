# CRUD API 與 Repository Pattern 規格書

## 目標

- 提供投票相關資源（Poll, PollOption, Vote）的標準 CRUD API。
- 採用 Repository Pattern 將資料存取邏輯與業務邏輯分離，提升可維護性與測試性。

## CRUD API 規劃

### Poll
- 建立投票（Create Poll）
- 查詢投票（Get Poll by id, List Polls）
- 更新投票（Update Poll）
- 刪除投票（Delete Poll）

### PollOption
- 建立選項（Create PollOption）
- 查詢選項（Get PollOption by id, List PollOptions by Poll）
- 更新選項（Update PollOption）[甲方不想要該功能]
- 刪除選項（Delete PollOption）[甲方不想要該功能]

### Vote
- 投票（Create Vote）
- 查詢投票紀錄（Get Vote by id, List Votes by Poll/User）
- 取消/更動投票（Update/Delete Vote）

## Repository Pattern 規劃

- 每個 Entity（Poll, PollOption, Vote）對應一個 Repository，負責資料存取（如 find, save, update, delete）。
- Service 層僅透過 Repository 操作資料，不直接依賴 ORM。
- Repository 可封裝複雜查詢（如統計、關聯查詢）。
- 方便單元測試，可用 mock repository。

## 其他注意事項

- Controller 層僅負責接收請求與回應，業務邏輯集中於 Service。
- Repository Pattern 可用 TypeORM 的自訂 Repository 或抽象類別實作。

---
本規格書僅為初步規劃，細節可依實作需求調整。
