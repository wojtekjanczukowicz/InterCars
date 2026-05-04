import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  timeout: 120000,

  retries: 2,

  use: {
    headless: false,
    slowMo: 50,
    storageState: 'state.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});