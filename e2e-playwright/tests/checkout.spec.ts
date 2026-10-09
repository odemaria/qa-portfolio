import { expect, test } from '../fixtures/test';
import { customer } from '../data/users';

const TAX_RATE = 0.08;
const products = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket'];

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(...products);
    await loggedIn.openCart();
    await expect(cartPage.itemNames).toHaveText(products);
    await cartPage.checkout.click();
  });

  test('compra completa con totales e impuesto correctos', async ({ page, checkoutPage }) => {
    await checkoutPage.fillCustomer(customer);

    const prices = (await checkoutPage.itemPrices.allInnerTexts()).map((t) => Number(t.replace('$', '')));
    const subtotal = prices.reduce((a, b) => a + b, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;

    expect(await checkoutPage.amount(checkoutPage.subtotal)).toBeCloseTo(subtotal, 2);
    expect(await checkoutPage.amount(checkoutPage.tax)).toBeCloseTo(tax, 2);
    expect(await checkoutPage.amount(checkoutPage.total)).toBeCloseTo(subtotal + tax, 2);

    await checkoutPage.finish.click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  for (const [campo, data, mensaje] of [
    ['nombre', { ...customer, firstName: '' }, 'Error: First Name is required'],
    ['apellido', { ...customer, lastName: '' }, 'Error: Last Name is required'],
    ['código postal', { ...customer, postalCode: '' }, 'Error: Postal Code is required'],
  ] as const) {
    test(`no avanza sin ${campo}`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillCustomer(data);

      await expect(checkoutPage.error).toHaveText(mensaje);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
