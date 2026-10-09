// Prueba de carga moderada con dos escenarios en paralelo:
// - navegantes: usuarios virtuales que suben, se mantienen y bajan (ramping-vus)
// - api: tasa constante de recomendaciones por segundo (constant-arrival-rate)
// Los volúmenes son bajos a propósito: el sitio es un servicio público compartido.
import { baseThresholds } from './lib/config.js';
import { browseAndRecommend, recommend } from './lib/flows.js';

export const options = {
  scenarios: {
    navegantes: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
    api: {
      executor: 'constant-arrival-rate',
      exec: 'apiOnly',
      rate: 2,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 5,
      maxVUs: 10,
      startTime: '30s',
    },
  },
  thresholds: {
    ...baseThresholds,
    restrictions_respected: ['rate>0.99'],
    // un umbral por escenario permite ver cuál se degrada primero
    'http_req_duration{scenario:navegantes}': ['p(95)<2000'],
    'http_req_duration{scenario:api}': ['p(95)<2000'],
  },
};

export default browseAndRecommend;

export function apiOnly() {
  recommend();
}
