// QuickPizza es la app de demostración que Grafana publica para practicar k6.
export const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

// Token público de demostración que usa la propia QuickPizza para su API.
export const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `token ${__ENV.QP_TOKEN || 'abcdef0123456789'}`,
};

// Umbrales compartidos: si se rompen, k6 termina con código de error y el CI falla.
export const baseThresholds = {
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.99'],
  'http_req_duration{name:home}': ['p(95)<1500'],
  'http_req_duration{name:recommendation}': ['p(95)<2000'],
  recommendation_duration: ['p(95)<2000', 'p(99)<3000'],
};
