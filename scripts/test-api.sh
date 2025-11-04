#!/bin/bash
# 投票系統 API 測試腳本（Curl 版本）

BASE_URL="http://localhost:3000"

echo "================================"
echo "投票系統 API 測試腳本 (Curl 版本)"
echo "================================"

# ==================== Health Check ====================
echo -e "\n[1] Health Check - 檢查服務狀態"
curl -s "$BASE_URL/health" | jq '.'

# ==================== 取得所有投票 ====================
echo -e "\n[2] GET /polls - 取得所有投票"
POLLS=$(curl -s "$BASE_URL/polls" | jq '.')
echo "$POLLS"
POLL_ID=$(echo "$POLLS" | jq -r '.[0].id')
echo "取得第一個投票 ID: $POLL_ID"

# ==================== 取得投票詳細資訊 ====================
echo -e "\n[3] GET /polls/:id - 取得投票詳細資訊"
curl -s "$BASE_URL/polls/$POLL_ID" | jq '.'

# ==================== 取得投票選項 ====================
echo -e "\n[4] GET /poll-options?pollId=:id - 取得投票選項"
OPTIONS=$(curl -s "$BASE_URL/poll-options?pollId=$POLL_ID" | jq '.')
echo "$OPTIONS"
OPTION_ID=$(echo "$OPTIONS" | jq -r '.[0].id')
echo "取得第一個選項 ID: $OPTION_ID"

# ==================== 建立投票 ====================
echo -e "\n[5] POST /polls - 建立新投票"
NEW_POLL=$(curl -s -X POST "$BASE_URL/polls" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2024 台灣總統大選",
    "description": "你支持誰成為台灣下一任總統？"
  }' | jq '.')
echo "$NEW_POLL"
NEW_POLL_ID=$(echo "$NEW_POLL" | jq -r '.id')
echo "新建投票 ID: $NEW_POLL_ID"

# ==================== 建立投票選項 ====================
echo -e "\n[6] POST /poll-options - 建立投票選項"
OPTION1=$(curl -s -X POST "$BASE_URL/poll-options" \
  -H "Content-Type: application/json" \
  -d "{
    \"pollId\": \"$NEW_POLL_ID\",
    \"text\": \"賴清德\"
  }" | jq '.')
echo "$OPTION1"
NEW_OPTION_ID1=$(echo "$OPTION1" | jq -r '.id')

OPTION2=$(curl -s -X POST "$BASE_URL/poll-options" \
  -H "Content-Type: application/json" \
  -d "{
    \"pollId\": \"$NEW_POLL_ID\",
    \"text\": \"侯友宜\"
  }" | jq '.')
echo "$OPTION2"

# ==================== 投票 ====================
echo -e "\n[7] POST /votes - 投票（匿名指紋）"
VOTE=$(curl -s -X POST "$BASE_URL/votes" \
  -H "Content-Type: application/json" \
  -d "{
    \"pollId\": \"$POLL_ID\",
    \"optionId\": \"$OPTION_ID\",
    \"fingerprint\": \"user-fingerprint-001\"
  }" | jq '.')
echo "$VOTE"
VOTE_ID=$(echo "$VOTE" | jq -r '.id')
echo "投票 ID: $VOTE_ID"

# ==================== 取得投票 ====================
echo -e "\n[8] GET /votes/:id - 取得投票詳細資訊"
curl -s "$BASE_URL/votes/$VOTE_ID" | jq '.'

# ==================== 取得某個投票的所有投票結果 ====================
echo -e "\n[9] GET /votes?pollId=:id - 取得某投票的所有投票結果"
curl -s "$BASE_URL/votes?pollId=$POLL_ID" | jq '.'

# ==================== 取得某個指紋的投票紀錄 ====================
echo -e "\n[10] GET /votes/user?fingerprint=:fingerprint - 取得某指紋的投票紀錄"
curl -s "$BASE_URL/votes/user?fingerprint=user-fingerprint-001" | jq '.'

# ==================== 更新投票 ====================
echo -e "\n[11] PATCH /votes/:id - 更新投票（改變主意）"
NEW_OPTION_ID=$(echo "$OPTIONS" | jq -r '.[1].id')
curl -s -X PATCH "$BASE_URL/votes/$VOTE_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"$VOTE_ID\",
    \"optionId\": \"$NEW_OPTION_ID\"
  }" | jq '.'

# ==================== 更新投票資訊 ====================
echo -e "\n[12] PUT /polls/:id - 更新投票資訊"
curl -s -X PUT "$BASE_URL/polls/$POLL_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2024 美國總統大選 (已更新)",
    "description": "最新的投票資訊"
  }' | jq '.'

# ==================== 刪除投票 ====================
echo -e "\n[13] DELETE /votes/:id - 刪除投票（取消投票）"
curl -s -X DELETE "$BASE_URL/votes/$VOTE_ID" | jq '.'

# ==================== 驗證投票已刪除 ====================
echo -e "\n[14] 驗證投票已刪除"
curl -s "$BASE_URL/votes?pollId=$POLL_ID" | jq '.'

# ==================== 刪除投票 ====================
echo -e "\n[15] DELETE /polls/:id - 刪除投票"
curl -s -X DELETE "$BASE_URL/polls/$NEW_POLL_ID" | jq '.'

echo -e "\n================================"
echo "✅ 所有 API 測試完成！"
echo "================================"
