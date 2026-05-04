import { Page, expect } from '@playwright/test';
import { parsePrice } from '../utils/price';

export class CartPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('https://intercars.pl/koszyk');
  }

  async verifyProducts(expectedProducts: { name: string; price: number }[]) {
    const items = this.page.locator('[data-testid="cart-item"]');

    await expect(items).toHaveCount(expectedProducts.length);

    for (let i = 0; i < expectedProducts.length; i++) {
      const item = items.nth(i);

      const name = await item
        .locator('.product-name, h2, h3')
        .first()
        .innerText();

      const priceText = await item
        .locator('[data-testid="price"]')
        .innerText();

      const price = parsePrice(priceText);

      expect(name).toContain(expectedProducts[i].name);
      expect(price).toBeCloseTo(expectedProducts[i].price, 1);
    }
  }
}
