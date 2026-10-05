import { test, expect } from '@playwright/test'

test('приложение рендерится', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})