import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continue: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finish: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continue = page.getByTestId('continue');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finish = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCustomer(data: { firstName?: string; lastName?: string; postalCode?: string }) {
    if (data.firstName !== undefined) await this.firstName.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastName.fill(data.lastName);
    if (data.postalCode !== undefined) await this.postalCode.fill(data.postalCode);
    await this.continue.click();
  }

  /** Extrae el monto de etiquetas como "Item total: $39.98". */
  async amount(label: Locator): Promise<number> {
    const text = await label.innerText();
    return Number(text.split('$')[1]);
  }
}
