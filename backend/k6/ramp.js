import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300', 'p(99)<800'],
  },
  scenarios: {
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 200 },
        { duration: '2m', target: 500 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
};

const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:3000';
const HEALTH_PATH = __ENV.K6_HEALTH_PATH || '/health';

export default function () {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': `${__VU}-${__ITER}-${Date.now()}`,
  };
  const res = http.get(`${BASE_URL}${HEALTH_PATH}`, { headers });
  check(res, { '200': (r) => r.status === 200 });
  sleep(1);
}
