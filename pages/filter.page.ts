import { Page, expect } from '@playwright/test';

export class FilterPage {
  constructor(private page: Page) {}

  async applyRandomFilter(): Promise<number> {
    const filterLinks = this.page
      .locator('.filters a')
      .filter({ has: this.page.locator('.group-filter-name') });

    await expect(filterLinks.first()).toBeVisible({ timeout: 60000 });

    const count = await filterLinks.count();

    let sum = 0;

    for (let i = 0; i < count; i++) {
      const text = await filterLinks.nth(i).innerText();
      const match = text.replace(/\s/g, '').match(/\((\d+)\)/);
      if (match) sum += parseInt(match[1], 10);
    }

    const randomIndex = Math.floor(Math.random() * Math.min(count, 5));

    await filterLinks.nth(randomIndex).click();
    await this.page.waitForLoadState('networkidle');

    return sum;
  }
}
