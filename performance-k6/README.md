# Performance · k6

Pruebas de rendimiento de [QuickPizza](https://quickpizza.grafana.com), la aplicación de demostración que Grafana publica para practicar k6.

## Recorrido simulado

1. **home**: carga la página principal.
2. **catálogo**: pide frases, masas y herramientas en paralelo (`http.batch`).
3. **recomendación**: pide una pizza con restricciones al azar (calorías, vegetariana, ingredientes y herramientas excluidas).

Además de medir tiempos, cada respuesta se valida **funcionalmente bajo carga**: la pizza recomendada no puede traer herramientas ni ingredientes excluidos, y debe ser vegetariana si se pidió. Esa tasa se registra en la métrica `restrictions_respected`.

## Pruebas

| Script | Objetivo | Perfil | Dónde corre |
|--------|----------|--------|-------------|
| `smoke.js` | Verificar que el flujo funciona y que los tiempos son razonables | 2 VUs durante 30 s | CI en cada PR, en `main` y semanal |
| `load.js` | Comportamiento con carga sostenida | Escenario `navegantes` (rampa a 10 VUs) + escenario `api` (2 recomendaciones/s constantes) | Solo manual desde Actions |

Los volúmenes son bajos a propósito: el sitio es un servicio público compartido.

## Umbrales

Si alguno se rompe, k6 termina con error y el CI falla.

| Métrica | Umbral |
|---------|--------|
| Errores HTTP (`http_req_failed`) | < 1 % |
| Checks | > 99 % |
| p95 home | < 1,5 s |
| p95 / p99 recomendación | < 2 s / < 3 s |
| Restricciones respetadas | 100 % en humo, > 99 % en carga |
| p95 por escenario (carga) | < 2 s |

## Diseño

- Configuración y umbrales compartidos en `lib/config.js`; el recorrido en `lib/flows.js`.
- Métricas propias: `recommendation_duration` (Trend) y `restrictions_respected` (Rate).
- Requests etiquetadas (`tags.name`) para tener umbrales por endpoint, y escenarios con `exec` para separar la navegación de la carga directa a la API.
- En CI se publica el **dashboard HTML de k6** y el resumen JSON como artefactos.

## Cómo correrlo

Requiere [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).

```bash
k6 run smoke.js
k6 run load.js
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=report.html k6 run smoke.js   # con reporte HTML
k6 run -e BASE_URL=http://localhost:3333 smoke.js                            # otra instancia
```
