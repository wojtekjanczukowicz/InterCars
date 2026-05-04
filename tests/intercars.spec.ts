import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CategoryPage } from '../pages/category.page';
import { FilterPage } from '../pages/filter.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';

test('Intercars - scenariusz zakupowy', async ({ page }) => {
  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const filter = new FilterPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.goto();
  await home.acceptCookies();
  await home.openAllProducts();

  const categoryCount = await category.selectBiggestCategory();
  expect(categoryCount).toBeGreaterThan(0);

  const filterSum = await filter.applyRandomFilter();
  expect(filterSum).toBeGreaterThan(0);

  const addedProducts = await product.addProducts(2);

  await cart.open();
  await cart.verifyProducts(addedProducts);
});
