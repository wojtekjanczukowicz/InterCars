import { test } from '@playwright/test';

test('setup session', async ({ page }) => {
  await page.goto('https://intercars.pl', {
    waitUntil: 'domcontentloaded',
  });

  console.log('➡️ Rozwiąż CAPTCHA / weryfikację ręcznie');

  await page.pause();

  await page.context().storageState({ path: 'state.json' });

  console.log('✅ Zapisano sesję');
});