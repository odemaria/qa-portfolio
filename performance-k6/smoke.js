// Prueba de humo: pocos usuarios, poco tiempo. Verifica que el flujo funciona y que
// los tiempos están dentro de lo esperado antes de pensar en cargas mayores.
import { baseThresholds } from './lib/config.js';
import { browseAndRecommend } from './lib/flows.js';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    ...baseThresholds,
    restrictions_respected: ['rate==1'],
  },
};

export default browseAndRecommend;
