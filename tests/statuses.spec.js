import { test, expect } from '@playwright/test'
import LoginPage from '../pages/login.page'
import StatusesPage from '../pages/statuses.page'

const userData = {
  username: 'username',
  password: 'password',
}

test.describe('Statuses', () => {
  let loginPage
  let statusesPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    statusesPage = new StatusesPage(page)
    await loginPage.goto()
    await loginPage.login(userData.username, userData.password)
    await statusesPage.goto()
  })

  // 1. Форма создания отображается
  test('renders create status form', async () => {
    await statusesPage.createButton.click()
    await expect(statusesPage.nameInput).toBeVisible()
    await expect(statusesPage.slugInput).toBeVisible()
  })

  // 2. Создание нового статуса
  test('creates new status', async () => {
    const newStatus = {
      name: `created-${Date.now()}`,
      slug: `Created-${Date.now()}-slug`,
    }
    await statusesPage.createStatus(newStatus)
    await expect(statusesPage.getStatusRow(newStatus.name)).toBeVisible()
  })

  // 3. Список показывает name и slug
  test('shows statuses list with main info', async () => {
    const newStatus = {
      name: `list-${Date.now()}`,
      slug: `List-${Date.now()}-slug`,
    }
    await statusesPage.createStatus(newStatus)
    // Проверяем заголовки колонок
    await expect(statusesPage.nameColumnHeader).toBeVisible()
    await expect(statusesPage.slugColumnHeader).toBeVisible()
    // Проверяем содержимое строки
    const row = statusesPage.getStatusRow(newStatus.name)
    await expect(row).toContainText(newStatus.name)
    await expect(row).toContainText(newStatus.slug)
  })

  // 4. Редактирование
  test('edits status', async () => {
    const newStatus = {
      name: `edit-${Date.now()}`,
      slug: 'Before',
    }
    const updatedName = `updated-${Date.now()}`
    await statusesPage.createStatus(newStatus)
    await statusesPage.editStatus(newStatus.name, {
      newName: updatedName,
      slug: 'After',
    })
    const row = statusesPage.getStatusRow(updatedName)
    await expect(row).toContainText(updatedName)
    await expect(row).toContainText('After')
  })

  // 5. Удаление одного статуса
  test('deletes status', async () => {
    const newStatus = {
      name: `delete-${Date.now()}`,
      slug: 'Delete',
    }
    await statusesPage.createStatus(newStatus)
    await expect(statusesPage.getStatusRow(newStatus.name)).toBeVisible()
    await statusesPage.deleteStatus(newStatus.name)
    await expect(statusesPage.getStatusRow(newStatus.name)).not.toBeVisible()
  })

  // 6. Массовое удаление
  test('bulk deletes all statuses', async () => {
    await statusesPage.selectAll()
    await expect(statusesPage.selectedCountText).toBeVisible()
    await expect(statusesPage.selectAllCheckbox).toBeChecked()
    await statusesPage.bulkDelete()
    await expect(statusesPage.noStatusesMessage).toBeVisible()
  })
})
