import { Page, expect } from '@playwright/test';
import { parsePrice } from '../utils/price';

export class ProductPage {
  constructor(private page: Page) {}

  async addProducts(countToAdd: number) {
    const buttons = this.page.locator(
      'button.add-to-cart-js-33, button#fc-add-cart'
    );

    await expect(buttons.first()).toBeVisible({ timeout: 60000 });

    const count = await buttons.count();
    const toAdd = Math.min(countToAdd, count);

    const added: { name: string; price: number }[] = [];

    for (let i = 0; i < toAdd; i++) {
      const card = buttons.nth(i).locator('xpath=ancestor::*[1]');

      const name =
        (await card
          .locator('h2, h3, .product-name')
          .first()
          .innerText()
          .catch(() => 'UNKNOWN')) || 'UNKNOWN';

      const priceText = await card
        .locator('.price, [data-testid="price"]')
        .first()
        .innerText();

      const price = parsePrice(priceText);

      added.push({ name, price });

      await buttons.nth(i).click();

      const continueBtn = this.page.locator('text=Kontynuuj zakupy').first();

      try {
        await continueBtn.waitFor({ timeout: 5000 });
        await continueBtn.click();
      } catch {}

      await this.page.waitForTimeout(800);
    }

    return added;
  }
}
