# QA Portfolio

[![E2E · Playwright](https://github.com/odemaria/qa-portfolio/actions/workflows/e2e-playwright.yml/badge.svg)](https://github.com/odemaria/qa-portfolio/actions/workflows/e2e-playwright.yml)
[![API · Karate](https://github.com/odemaria/qa-portfolio/actions/workflows/api-karate.yml/badge.svg)](https://github.com/odemaria/qa-portfolio/actions/workflows/api-karate.yml)
[![Performance · k6](https://github.com/odemaria/qa-portfolio/actions/workflows/performance-k6.yml/badge.svg)](https://github.com/odemaria/qa-portfolio/actions/workflows/performance-k6.yml)

Portafolio de automatización de pruebas de **Omar Demaría**, QA Lead y QA Automation Engineer.

Cada módulo es un proyecto independiente que corre contra una aplicación pública pensada para practicar testing. Todos corren en CI con GitHub Actions y publican su reporte como artefacto.

| Módulo | Qué prueba | Stack | Alcance |
|--------|------------|-------|----------|
| [`e2e-playwright`](e2e-playwright) | Login, catálogo, carrito y checkout de SauceDemo | Playwright · TypeScript · Page Object Model | Chromium, Firefox y móvil |
| [`api-karate`](api-karate) | Autenticación, CRUD, búsqueda y seguridad de la API de Restful-Booker | Karate · Java 17 · JUnit 5 | Esquemas, casos negativos y hallazgos documentados |
| [`performance-k6`](performance-k6) | Recorrido de usuario y API de recomendaciones de QuickPizza | k6 · JavaScript | Umbrales por endpoint y validación funcional bajo carga |

## Principios

- **Pruebas legibles antes que ingeniosas**: el nombre de cada prueba describe el comportamiento esperado.
- **Independencia**: cada prueba prepara sus propios datos y no depende del orden de ejecución.
- **Respeto por los servicios públicos**: las pruebas de carga contra sitios de terceros usan volúmenes bajos y solo el perfil de humo corre en CI.

## Contacto

[LinkedIn](https://www.linkedin.com/in/omardemaria) · [GitHub](https://github.com/odemaria)
