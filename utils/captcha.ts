export async function handleCaptcha(page: any) {
  const captcha = page.getByText(
    /verify you are human|captcha|just a moment|cloudflare/i
  );

  const visible = await captcha.first().isVisible().catch(() => false);

  if (visible) {
    console.log('🚨 CAPTCHA wykryta — przejdź ręcznie');

    await page.pause();

    await page.context().storageState({ path: 'state.json' });
  }
}
