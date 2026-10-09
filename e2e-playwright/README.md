# E2E · Playwright

Pruebas end-to-end de [SauceDemo](https://www.saucedemo.com), una tienda de demostración hecha para practicar automatización.

## Qué cubre

| Suite | Casos |
|-------|-------|
| `login.spec.ts` | Login válido, usuario bloqueado, contraseña incorrecta sin filtrar si el usuario existe, campos obligatorios, rutas protegidas sin sesión |
| `inventory.spec.ts` | Orden por precio y por nombre, contador del carrito al agregar y quitar, persistencia del carrito al recargar |
| `checkout.spec.ts` | Compra completa validando subtotal, impuesto (8 %) y total calculados desde los precios, y validaciones del formulario |

Cada caso corre en **Chromium, Firefox y un Pixel 7 emulado**.

## Diseño

- **Page Object Model** (`pages/`): los selectores viven en un solo lugar; las pruebas hablan en términos del negocio.
- **Fixtures** (`fixtures/test.ts`): inyectan los Page Objects y una sesión iniciada (`loggedIn`), así cada prueba arranca limpia y sin depender de otra.
- **Selectores estables**: `getByTestId` sobre los atributos `data-test` del sitio, y `getByRole` para botones.
- **Casos parametrizados** para validaciones que solo cambian en los datos.
- **Evidencia en fallos**: captura, video y trace en el primer reintento; el reporte HTML se publica como artefacto en CI.

## Cómo correrlo

```bash
npm ci
npx playwright install chromium firefox
npm test                 # los 3 proyectos
npm run test:chromium    # solo Chromium
npm run report           # abre el último reporte
```
