import { Page, expect } from '@playwright/test';

export class CategoryPage {
  constructor(private page: Page) {}

  async selectBiggestCategory(): Promise<number> {
    const categories = this.page.locator(
      'a.btn.btn-default.btn-link.waves-effect'
    );

    await expect(categories.first()).toBeVisible({ timeout: 60000 });

    const count = await categories.count();

    let maxValue = -1;
    let maxIndex = 0;

    for (let i = 0; i < count; i++) {
      const text = await categories.nth(i).innerText();
      const match = text.replace(/\s/g, '').match(/\((\d+)\)/);
      const value = match ? parseInt(match[1], 10) : 0;

      if (value > maxValue) {
        maxValue = value;
        maxIndex = i;
      }
    }

    await categories.nth(maxIndex).click();

    return maxValue;
  }
}
