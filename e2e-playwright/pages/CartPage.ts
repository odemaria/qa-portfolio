import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkout: Locator;
  readonly continueShopping: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkout = page.getByTestId('checkout');
    this.continueShopping = page.getByTestId('continue-shopping');
  }

  async names(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }
}
