import { Page } from '@playwright/test';
import { handleCaptcha } from '../utils/captcha';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://intercars.pl', {
      waitUntil: 'domcontentloaded',
    });

    await handleCaptcha(this.page);
  }

  async acceptCookies() {
    const btn = this.page.getByRole('button', {
      name: /akceptuj|accept|zgadzam|zaakceptuj/i,
    });

    try {
      await btn.first().waitFor({ timeout: 10000 });
      await btn.first().click();
    } catch {}
  }

  async openAllProducts() {
    await this.page.getByRole('link', { name: /^Wszystkie$/ }).click();
    await this.page.getByRole('link', { name: /zobacz wszystkie/i }).click();

    await handleCaptcha(this.page);
  }
}
