import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// NOTE: 移除 randomSeed 以避免在初始化階段於某些環境觸發 __ENV 或匯入問題。
// 若日後需要可重現的隨機序列，可在 k6 環境確認可用後再恢復並加入安全檢查。

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<600', 'p(99)<1200'],
  },
  scenarios: {
    flow_ramp: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 200 },
        { duration: '2m', target: 400 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
};

const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:3000';

function json(res) {
  try {
    return res.json();
  } catch (_) {
    return null;
  }
}

function headers() {
  // 在 setup 階段沒有 __VU/__ITER，使用 typeof 安全取得，避免 ReferenceError
  const vu = typeof __VU !== 'undefined' ? __VU : 'setup';
  const iter = typeof __ITER !== 'undefined' ? __ITER : 'setup';
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': `${vu}-${iter}-${Date.now()}`,
  };
}

export function setup() {
  // 允許重用既有 poll（透過 env 注入），否則自動建立一組 A/B 選項
  const reusePollId = __ENV.K6_POLL_ID;
  const reuseOptionIds = __ENV.K6_OPTION_IDS ? JSON.parse(__ENV.K6_OPTION_IDS) : null;

  if (reusePollId && reuseOptionIds && reuseOptionIds.length >= 2) {
    return { pollId: reusePollId, optionIds: reuseOptionIds };
  }

  // 建立 Poll
  const createPollBody = JSON.stringify({
    title: `Load Test Poll ${Date.now()}`,
    description: 'Auto-created by k6 flow test',
  });
  const cr = http.post(`${BASE_URL}/polls`, createPollBody, { headers: headers(), tags: { name: 'polls_create' } });
  check(cr, { 'create poll 201/200': (r) => r.status === 201 || r.status === 200 });
  const poll = json(cr) || {};
  const pollId = poll.id;

  // 建立 2 個選項
  const optionIds = [];
  ['A', 'B'].forEach((label) => {
    const body = JSON.stringify({ pollId, text: label });
    const or = http.post(`${BASE_URL}/poll-options`, body, { headers: headers(), tags: { name: 'options_create' } });
    check(or, { 'create option 201/200': (r) => r.status === 201 || r.status === 200 });
    const opt = json(or) || {};
    if (opt.id) optionIds.push(opt.id);
  });

  return { pollId, optionIds };
}

export default function (data) {
  const { pollId, optionIds } = data;
  if (!pollId || !optionIds || optionIds.length < 2) {
    return;
  }

  const fp = `fingerprint-vu-${__VU}`; // 同一個 VU 模擬同一個用戶可更動投票
  const chosen = randomItem(optionIds);

  // 建立投票
  const createVoteBody = JSON.stringify({ pollId, optionId: chosen, fingerprint: fp });
  const vr = http.post(`${BASE_URL}/votes`, createVoteBody, { headers: headers(), tags: { name: 'votes_create' } });
  check(vr, {
    'vote create 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  const created = json(vr) || {};
  const voteId = created.id;

  // 有 50% 機率更動投票（切換到另一個選項）
  if (voteId && Math.random() < 0.5) {
    const other = optionIds.find((id) => id !== chosen) || chosen;
    const ur = http.patch(`${BASE_URL}/votes/${voteId}`, JSON.stringify({ optionId: other }), {
      headers: headers(),
      tags: { name: 'votes_update' },
    });
    check(ur, { 'vote update 2xx': (r) => r.status >= 200 && r.status < 300 });
  }

  // 有 20% 機率取消投票（刪除）
  if (voteId && Math.random() < 0.2) {
    const dr = http.del(`${BASE_URL}/votes/${voteId}`, null, { headers: headers(), tags: { name: 'votes_delete' } });
    check(dr, { 'vote delete 2xx/204': (r) => (r.status >= 200 && r.status < 300) || r.status === 204 });
  }

  // 健康檢查（輕量 GET）
  const hr = http.get(`${BASE_URL}/health`, { headers: headers(), tags: { name: 'health' } });
  check(hr, { 'health 200': (r) => r.status === 200 });

  // 模擬人類節奏
  sleep(0.5 + Math.random() * 0.5);
}

export function teardown(data) {
  // 可選清理：若需要，可在此依 pollId 列出投票後逐一刪除。
  // 注意：PollOption 無刪除 API，Poll 刪除可能受外鍵影響，故預設不清理。
}
