# 投票系統 API 測試腳本
# 使用 PowerShell 執行此腳本

$BASE_URL = "http://localhost:3000"

Write-Host "================================" -ForegroundColor Green
Write-Host "投票系統 API 測試腳本" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# ==================== Health Check ====================
Write-Host "`n[1] Health Check - 檢查服務狀態" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/health" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# ==================== 取得所有投票 ====================
Write-Host "`n[2] GET /polls - 取得所有投票" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/polls" -Method Get -ContentType "application/json"
$polls = $response.Content | ConvertFrom-Json
$polls | ConvertTo-Json -Depth 10
$pollId = $polls[0].id
Write-Host "取得第一個投票 ID: $pollId" -ForegroundColor Yellow

# ==================== 取得投票詳細資訊 ====================
Write-Host "`n[3] GET /polls/:id - 取得投票詳細資訊" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/polls/$pollId" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# ==================== 取得投票選項 ====================
Write-Host "`n[4] GET /poll-options?pollId=:id - 取得投票選項" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/poll-options?pollId=$pollId" -Method Get -ContentType "application/json"
$options = $response.Content | ConvertFrom-Json
$options | ConvertTo-Json -Depth 10
$optionId = $options[0].id
Write-Host "取得第一個選項 ID: $optionId" -ForegroundColor Yellow

# ==================== 建立投票 ====================
Write-Host "`n[5] POST /polls - 建立新投票" -ForegroundColor Cyan
$newPoll = @{
    title = "2024 台灣總統大選"
    description = "你支持誰成為台灣下一任總統？"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/polls" -Method Post -ContentType "application/json" -Body $newPoll
$newPollData = $response.Content | ConvertFrom-Json
$newPollData | ConvertTo-Json -Depth 10
$newPollId = $newPollData.id
Write-Host "新建投票 ID: $newPollId" -ForegroundColor Yellow

# ==================== 建立投票選項 ====================
Write-Host "`n[6] POST /poll-options - 建立投票選項" -ForegroundColor Cyan
$option1 = @{
    pollId = $newPollId
    text = "賴清德"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/poll-options" -Method Post -ContentType "application/json" -Body $option1
$option1Data = $response.Content | ConvertFrom-Json
$option1Data | ConvertTo-Json -Depth 10
$newOptionId1 = $option1Data.id

$option2 = @{
    pollId = $newPollId
    text = "侯友宜"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/poll-options" -Method Post -ContentType "application/json" -Body $option2
$option2Data = $response.Content | ConvertFrom-Json
$option2Data | ConvertTo-Json -Depth 10

# ==================== 建立投票 ====================
Write-Host "`n[7] POST /votes - 投票（匿名指紋）" -ForegroundColor Cyan
$vote = @{
    pollId = $pollId
    optionId = $optionId
    fingerprint = "user-fingerprint-001"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/votes" -Method Post -ContentType "application/json" -Body $vote
$voteData = $response.Content | ConvertFrom-Json
$voteData | ConvertTo-Json -Depth 10
$voteId = $voteData.id
Write-Host "投票 ID: $voteId" -ForegroundColor Yellow

# ==================== 取得投票 ====================
Write-Host "`n[8] GET /votes/:id - 取得投票詳細資訊" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/votes/$voteId" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# ==================== 取得某個投票的所有投票結果 ====================
Write-Host "`n[9] GET /votes?pollId=:id - 取得某投票的所有投票結果" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/votes?pollId=$pollId" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# ==================== 取得某個指紋的投票紀錄 ====================
Write-Host "`n[10] GET /votes/user?fingerprint=:fingerprint - 取得某指紋的投票紀錄" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/votes/user?fingerprint=user-fingerprint-001" -Method Get -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# ==================== 更新投票 ====================
Write-Host "`n[11] PATCH /votes/:id - 更新投票（改變主意）" -ForegroundColor Cyan
$updateVote = @{
    id = $voteId
    optionId = $options[1].id
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/votes/$voteId" -Method Patch -ContentType "application/json" -Body $updateVote
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# ==================== 更新投票資訊 ====================
Write-Host "`n[12] PUT /polls/:id - 更新投票資訊" -ForegroundColor Cyan
$updatePoll = @{
    title = "2024 美國總統大選 (已更新)"
    description = "最新的投票資訊"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/polls/$pollId" -Method Put -ContentType "application/json" -Body $updatePoll
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# ==================== 刪除投票 ====================
Write-Host "`n[13] DELETE /votes/:id - 刪除投票（取消投票）" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/votes/$voteId" -Method Delete -ContentType "application/json"
Write-Host $response.Content -ForegroundColor Green

# ==================== 驗證投票已刪除 ====================
Write-Host "`n[14] 驗證投票已刪除" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/votes?pollId=$pollId" -Method Get -ContentType "application/json"
    $remainingVotes = $response.Content | ConvertFrom-Json
    $remainingVotes | ConvertTo-Json -Depth 10
} catch {
    Write-Host "投票已刪除" -ForegroundColor Green
}

# ==================== 刪除投票 ====================
Write-Host "`n[15] DELETE /polls/:id - 刪除投票" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/polls/$newPollId" -Method Delete -ContentType "application/json"
Write-Host $response.Content -ForegroundColor Green

Write-Host "`n================================" -ForegroundColor Green
Write-Host "✅ 所有 API 測試完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
