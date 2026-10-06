import { test, expect } from '@playwright/test'
import LoginPage from '../pages/login.page'

test.describe('Authentication', () => {
  const userData = {
    username: 'username',
    password: 'password',
  }

  let loginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('renders application', async () => {
    await expect(loginPage.signInButton).toBeVisible()
  })

  test('authorizes user', async () => {
    await loginPage.login(userData.username, userData.password)
    await expect(loginPage.profileButton).toBeVisible()
  })

  test('logs out user', async () => {
    await loginPage.login(userData.username, userData.password)
    await loginPage.logout()
    await expect(loginPage.signInButton).toBeVisible()
  })
})
