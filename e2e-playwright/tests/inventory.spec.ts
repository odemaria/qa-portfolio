import { expect, test } from '../fixtures/test';

test.describe('Inventario', () => {
  test('ordena por precio de menor a mayor', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');

    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('ordena por precio de mayor a menor', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');

    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('ordena por nombre de la Z a la A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');

    const names = await loggedIn.names();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('el contador del carrito sigue lo que se agrega y se quita', async ({ loggedIn }) => {
    await expect(loggedIn.cartBadge).toBeHidden();

    await loggedIn.addToCart('Sauce Labs Backpack', 'Sauce Labs Bike Light');
    await expect(loggedIn.cartBadge).toHaveText('2');

    await loggedIn.removeFromCart('Sauce Labs Backpack');
    await expect(loggedIn.cartBadge).toHaveText('1');
  });

  test('el carrito se mantiene al recargar la página', async ({ page, loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Onesie');
    await page.reload();

    await expect(loggedIn.cartBadge).toHaveText('1');
  });
});
