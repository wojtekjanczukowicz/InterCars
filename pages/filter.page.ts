import { Page, expect } from '@playwright/test';

export class FilterPage {
  constructor(private page: Page) {}

  private get filterLinks() {
    return this.page
      .locator('.filters a')
      .filter({ has: this.page.locator('.group-filter-name') });
  }

  async waitForFilters() {
    await expect(this.filterLinks.first()).toBeVisible({ timeout: 60000 });
  }

  async getFiltersSum(): Promise<number> {
    await this.waitForFilters();

    const count = await this.filterLinks.count();

    let sum = 0;

    for (let i = 0; i < count; i++) {
      const text = await this.filterLinks.nth(i).innerText();
      const match = text.replace(/\s/g, '').match(/\((\d+)\)/);

      if (match) {
        sum += parseInt(match[1], 10);
      }
    }

    return sum;
  }

  async applyRandomFilter() {
    await this.waitForFilters();

    const count = await this.filterLinks.count();

    const randomIndex = Math.floor(Math.random() * Math.min(count, 5));

    const selected = this.filterLinks.nth(randomIndex);

    const filterName = await selected
      .locator('.group-filter-name')
      .innerText()
      .catch(() => 'UNKNOWN');

    console.log('🎯 Selected filter:', filterName);

    await selected.click();
    await this.page.waitForLoadState('networkidle');
  }
}
