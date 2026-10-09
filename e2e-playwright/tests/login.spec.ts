import { expect, test } from '../fixtures/test';
import { users } from '../data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('un usuario válido entra al inventario', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('un usuario bloqueado ve el motivo y no entra', async ({ page, loginPage }) => {
    await loginPage.login(users.lockedOut);

    await expect(loginPage.error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('una contraseña incorrecta muestra un error genérico', async ({ loginPage }) => {
    await loginPage.login(users.standard, 'clave-incorrecta');

    // El mensaje no debe revelar si el usuario existe
    await expect(loginPage.error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  for (const [campo, username, password, mensaje] of [
    ['usuario', '', 'secret_sauce', 'Epic sadface: Username is required'],
    ['contraseña', users.standard, '', 'Epic sadface: Password is required'],
  ] as const) {
    test(`exige ${campo}`, async ({ loginPage }) => {
      await loginPage.login(username, password);
      await expect(loginPage.error).toHaveText(mensaje);
    });
  }

  test('las páginas internas no se pueden abrir sin sesión', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
