import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CategoryPage } from '../pages/category.page';
import { FilterPage } from '../pages/filter.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { handleCaptcha } from '../utils/captcha';

test('Intercars - scenariusz zakupowy', async ({ page }) => {
  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const filter = new FilterPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  // =========================
  // START
  // =========================
  await home.goto();
  await home.acceptCookies();
  await home.openAllProducts();

  await handleCaptcha(page);

  // =========================
  // KATEGORIA
  // =========================
  const categoryCount = await category.selectBiggestCategory();

  expect(categoryCount).toBeGreaterThan(0);

  await handleCaptcha(page);

  // =========================
  // FILTRY – WALIDACJA
  // =========================
  const filtersSum = await filter.getFiltersSum();

  console.log('📊 Category:', categoryCount);
  console.log('📊 Filters sum:', filtersSum);

  expect(filtersSum).toBeGreaterThan(0);

  // 🔥 BEZPIECZNA WALIDACJA
  expect(filtersSum).toBeGreaterThanOrEqual(categoryCount);

  // =========================
  // FILTR – AKCJA
  // =========================
  await filter.applyRandomFilter();

  await handleCaptcha(page);

  // =========================
  // PRODUKTY
  // =========================
  const addedProducts = await product.addProducts(2);

  // =========================
  // KOSZYK
  // =========================
  await cart.open();
  await handleCaptcha(page);

  await cart.verifyProducts(addedProducts);
});
