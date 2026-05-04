import { test, expect } from '@playwright/test';
import { handleCaptcha } from '../utils/captcha';
import { parsePrice } from '../utils/price';

test('Intercars - scenariusz zakupowy', async ({ page }) => {
  // =========================
  // STRONA STARTOWA
  // =========================
  await page.goto('https://intercars.pl', {
    waitUntil: 'domcontentloaded',
  });

  await handleCaptcha(page);

  const blocked = await page
    .getByText(/performing security verification/i)
    .isVisible()
    .catch(() => false);

  if (blocked) {
    console.log('🚨 Cloudflare active - manual step required');
    await page.pause();
  }

  // =========================
  // COOKIES
  // =========================
  const acceptAllBtn = page.getByRole('button', {
    name: /akceptuj|accept|zgadzam|zaakceptuj/i,
  });

  await acceptAllBtn.first().waitFor({ timeout: 10000 }).catch(() => {});

  for (let i = 0; i < 3; i++) {
    try {
      if (await acceptAllBtn.first().isVisible().catch(() => false)) {
        await acceptAllBtn.first().click({ timeout: 3000 });
        break;
      }
    } catch {
      await page.waitForTimeout(1000);
    }
  }
  

  // =========================
  // MENU
  // =========================
  await page.getByRole('link', { name: /^Wszystkie$/ }).click();
  await page.getByRole('link', { name: /zobacz wszystkie/i }).click();

  await handleCaptcha(page);

  // =========================
  // KATEGORIE
  // =========================
  const categories = page.locator('a.btn.btn-default.btn-link.waves-effect');

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

  const selectedCategoryCount = maxValue;

  const bestCategory = categories.nth(maxIndex);
  await bestCategory.scrollIntoViewIfNeeded();
  await bestCategory.click();

  await handleCaptcha(page);

  // =========================
  // FILTRY (FIX: brak duplikatów)
  // =========================
  const filterLinks = page
    .locator('.filters a')
    .filter({ has: page.locator('.group-filter-name') });

  await expect(filterLinks.first()).toBeVisible({ timeout: 60000 });

  const filterCount = await filterLinks.count();
  let filtersSum = 0;

  for (let i = 0; i < filterCount; i++) {
    const text = await filterLinks.nth(i).innerText();
    const match = text.replace(/\s/g, '').match(/\((\d+)\)/);
    if (match) filtersSum += parseInt(match[1], 10);
  }

  expect(selectedCategoryCount).toBeGreaterThan(0);
  expect(filtersSum).toBeGreaterThan(0);

  console.log('Category:', selectedCategoryCount, 'Filters:', filtersSum);

  const randomIndex = Math.floor(Math.random() * Math.min(filterCount, 5));

  const selectedFilter = filterLinks.nth(randomIndex);
  const filterText = await selectedFilter
    .locator('.group-filter-name')
    .innerText();

  console.log('🎯 Selected filter:', filterText);

  await selectedFilter.click();
  await page.waitForLoadState('networkidle');

  await handleCaptcha(page);

  // =========================
  // DODAWANIE PRODUKTÓW + ZAPIS
  // =========================

  const addButtons = page.locator(
    'button.add-to-cart-js-33, button#fc-add-cart'
  );

  await expect(addButtons.first()).toBeVisible({ timeout: 60000 });

  const addCount = await addButtons.count();
  const toAdd = Math.min(2, addCount);

  const addedProducts: {
    name: string;
    price: number;
  }[] = [];

  for (let i = 0; i < toAdd; i++) {
    const productCard = addButtons.nth(i).locator('xpath=ancestor::*[1]');

    // 🔹 NAZWA (fallback-safe)
    const name =
      (await productCard.locator('h2, h3, .product-name').first().innerText().catch(() => 'UNKNOWN')) ||
      'UNKNOWN';

    // 🔹 CENA
    const priceText = await productCard
      .locator('.price, [data-testid="price"]')
      .first()
      .innerText();

    const price = parsePrice(priceText);

    addedProducts.push({ name, price });

    console.log(`🛒 Dodano: ${name} | ${price}`);

    await addButtons.nth(i).click();

    const continueBtn = page.locator('text=Kontynuuj zakupy').first();

    try {
      await continueBtn.waitFor({ timeout: 5000 });
      await continueBtn.click();
    } catch {
      console.log('ℹ️ Brak modal "Kontynuuj zakupy"');
    }

    await page.waitForTimeout(800);
  }

  // =========================
// KOSZYK
// =========================
await page.goto('https://intercars.pl/koszyk');

await handleCaptcha(page);

const cartItems = page.locator('[data-testid="cart-item"]');

expect(await cartItems.count()).toBeGreaterThanOrEqual(toAdd);

// =========================
// WERYFIKACJA PRODUKTÓW
// =========================

for (let i = 0; i < toAdd; i++) {
  const cartItem = cartItems.nth(i);

  const cartName =
    await cartItem.locator('.product-name, h2, h3').first().innerText();

  const cartPriceText = await cartItem
    .locator('[data-testid="price"]')
    .innerText();

  const cartPrice = parsePrice(cartPriceText);

  const expected = addedProducts[i];

  console.log('🧾 CART:', cartName, cartPrice);
  console.log('📦 EXPECT:', expected.name, expected.price);

  expect(cartName).toContain(expected.name);
  expect(cartPrice).toBeCloseTo(expected.price, 1);
}

// =========================
// SUMA KOSZYKA vs SUMA DODANYCH PRODUKTÓW
// =========================

const totalText = await page
  .locator('[data-testid="total-price"]')
  .innerText();

const total = parsePrice(totalText);

const expectedTotal = addedProducts.reduce((sum, p) => sum + p.price, 0);

// log diagnostyczny
console.log('💰 EXPECTED TOTAL:', expectedTotal);
console.log('💰 CART TOTAL:', total);

// twarda walidacja
expect(total).toBeCloseTo(expectedTotal, 1);

// dodatkowy safety-check (wyłapuje np. rabaty, dostawę)
const diff = Math.abs(total - expectedTotal);

expect(diff).toBeLessThan(0.5);
});
