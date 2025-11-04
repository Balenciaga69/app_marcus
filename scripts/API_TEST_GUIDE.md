# API 測試指南

此目錄包含投票系統 API 的測試腳本。

## 前置準備

1. **啟動服務**

```bash
# 在 backend 目錄下
pnpm start:dev
```

服務會在 `http://localhost:3000` 運行，資料庫會自動填充種子資料（美國總統大選投票）。

## 測試方式

### 方法 1：使用 PowerShell 腳本（Windows）

```powershell
# 進入專案根目錄
cd app_marcus

# 執行 PowerShell 腳本
.\test-api.ps1
```

### 方法 2：使用 Bash 腳本（Linux/Mac 或 WSL）

```bash
# 進入專案根目錄
cd app_marcus

# 賦予執行權限
chmod +x test-api.sh

# 執行腳本
./test-api.sh
```

### 方法 3：手動 Curl 命令

你也可以複製下面的命令在終端中逐一執行。

#### 健康檢查
```bash
curl http://localhost:3000/health
```

#### 取得所有投票
```bash
curl http://localhost:3000/polls
```

#### 建立新投票
```bash
curl -X POST http://localhost:3000/polls \
  -H "Content-Type: application/json" \
  -d '{
    "title": "測試投票",
    "description": "這是一個測試投票"
  }'
```

#### 取得投票選項
```bash
# 替換 {pollId} 為實際的投票 ID
curl "http://localhost:3000/poll-options?pollId={pollId}"
```

#### 建立投票選項
```bash
curl -X POST http://localhost:3000/poll-options \
  -H "Content-Type: application/json" \
  -d '{
    "pollId": "{pollId}",
    "text": "選項文字"
  }'
```

#### 投票
```bash
curl -X POST http://localhost:3000/votes \
  -H "Content-Type: application/json" \
  -d '{
    "pollId": "{pollId}",
    "optionId": "{optionId}",
    "fingerprint": "user-unique-fingerprint"
  }'
```

#### 取得投票結果
```bash
# 獲取某個投票的所有結果
curl "http://localhost:3000/votes?pollId={pollId}"
```

#### 取得使用者投票記錄
```bash
curl "http://localhost:3000/votes/user?fingerprint={fingerprint}"
```

#### 更新投票（改變主意）
```bash
curl -X PATCH http://localhost:3000/votes/{voteId} \
  -H "Content-Type: application/json" \
  -d '{
    "id": "{voteId}",
    "optionId": "{newOptionId}"
  }'
```

#### 更新投票資訊
```bash
curl -X PUT http://localhost:3000/polls/{pollId} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新後的標題",
    "description": "更新後的描述"
  }'
```

#### 取消投票
```bash
curl -X DELETE http://localhost:3000/votes/{voteId}
```

#### 刪除投票
```bash
curl -X DELETE http://localhost:3000/polls/{pollId}
```

## API 端點列表

| 方法 | 端點 | 描述 |
|------|------|------|
| GET | `/health` | 健康檢查 |
| GET | `/polls` | 取得所有投票 |
| GET | `/polls/:id` | 取得投票詳細資訊 |
| POST | `/polls` | 建立新投票 |
| PUT | `/polls/:id` | 更新投票資訊 |
| DELETE | `/polls/:id` | 刪除投票 |
| GET | `/poll-options/:id` | 取得投票選項 |
| GET | `/poll-options?pollId=:id` | 取得某投票的所有選項 |
| POST | `/poll-options` | 建立投票選項 |
| GET | `/votes/:id` | 取得投票詳細資訊 |
| GET | `/votes?pollId=:id` | 取得某投票的所有投票結果 |
| GET | `/votes/user?fingerprint=:fingerprint` | 取得使用者投票記錄 |
| POST | `/votes` | 投票 |
| PATCH | `/votes/:id` | 更新投票（改變主意） |
| DELETE | `/votes/:id` | 取消投票 |

## 種子資料

應用啟動時會自動建立以下種子資料：

### 投票
- **標題**: 2024 美國總統大選
- **描述**: 你支持誰成為美國第47任總統？

### 選項
1. 川普 (Donald Trump)
2. 拜登 (Joe Biden)

你可以在此基礎上進行投票、更新或刪除操作。

## 常見指紋值

在測試中，你可以使用以下指紋值（代表不同的使用者）：

- `user-fingerprint-001`
- `user-fingerprint-002`
- `user-fingerprint-003`

## 排查問題

### 1. 連接錯誤
確保後端服務已啟動且在 `http://localhost:3000` 上運行。

### 2. 驗證錯誤
確保請求的 JSON 資料格式正確，必填欄位已提供。

### 3. 資料庫錯誤
確保 PostgreSQL 已啟動。如使用 Docker，執行：
```bash
docker-compose up -d
```

## 進階測試

### 使用 VS Code REST Client 擴充

1. 安裝「REST Client」擴充
2. 在專案根目錄建立 `test-api.http` 檔案
3. 在檔案中編寫 HTTP 請求
4. 點擊每個請求旁的「Send Request」按鈕

範例：
```http
### 取得所有投票
GET http://localhost:3000/polls

### 投票
POST http://localhost:3000/votes
Content-Type: application/json

{
  "pollId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "optionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "fingerprint": "user-fingerprint-001"
}
```

## 下一步

- 查看服務日誌了解請求處理情況
- 監控資料庫查詢效能
- 進行壓力測試（使用 k6）
