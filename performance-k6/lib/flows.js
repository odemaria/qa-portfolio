import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { API_HEADERS, BASE_URL } from './config.js';

export const recommendationDuration = new Trend('recommendation_duration', true);
export const restrictionsRespected = new Rate('restrictions_respected');

const EXCLUDED_TOOLS = ['Knife'];
const EXCLUDED_INGREDIENTS = ['Pepperoni', 'Anchovies'];

function randomRestrictions() {
  return {
    maxCaloriesPerSlice: 500 + Math.floor(Math.random() * 500),
    mustBeVegetarian: Math.random() < 0.5,
    excludedIngredients: EXCLUDED_INGREDIENTS,
    excludedTools: EXCLUDED_TOOLS,
    maxNumberOfToppings: 5,
    minNumberOfToppings: 2,
  };
}

/** Recorrido de un usuario: entra al sitio, mira el catálogo y pide una recomendación. */
export function browseAndRecommend() {
  group('home', () => {
    const res = http.get(`${BASE_URL}/`, { tags: { name: 'home' } });
    check(res, { 'home responde 200': (r) => r.status === 200 });
  });

  group('catalogo', () => {
    const responses = http.batch([
      ['GET', `${BASE_URL}/api/quotes`, null, { tags: { name: 'quotes' } }],
      ['GET', `${BASE_URL}/api/doughs`, null, { headers: API_HEADERS, tags: { name: 'doughs' } }],
      ['GET', `${BASE_URL}/api/tools`, null, { headers: API_HEADERS, tags: { name: 'tools' } }],
    ]);
    check(responses, { 'catálogo completo responde 200': (rs) => rs.every((r) => r.status === 200) });
  });

  sleep(1);

  recommend();

  sleep(1 + Math.random() * 2);
}

/** Pide una recomendación con restricciones al azar y valida que se respeten. */
export function recommend() {
  group('recomendacion', () => {
    const restrictions = randomRestrictions();
    const res = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(restrictions), {
      headers: API_HEADERS,
      tags: { name: 'recommendation' },
    });
    recommendationDuration.add(res.timings.duration);

    const ok = check(res, {
      'recomendación responde 200': (r) => r.status === 200,
      'trae una pizza con nombre': (r) => typeof r.json('pizza.name') === 'string',
    });
    if (!ok) return;

    // Validación funcional bajo carga: la recomendación debe respetar las restricciones
    const pizza = res.json('pizza');
    const respected = check(pizza, {
      'no usa herramientas excluidas': (p) => !EXCLUDED_TOOLS.includes(p.tool),
      'no usa ingredientes excluidos': (p) => !p.ingredients.some((i) => EXCLUDED_INGREDIENTS.includes(i.name)),
      'es vegetariana si se pidió': (p) => !restrictions.mustBeVegetarian || p.ingredients.every((i) => i.vegetarian),
    });
    restrictionsRespected.add(respected);
  });
}
