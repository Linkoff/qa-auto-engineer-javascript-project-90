import { test, expect } from '@playwright/test'
import LoginPage from '../pages/login.page'
import LabelsPage from '../pages/labels.page'

const userData = {
  username: 'username',
  password: 'password',
}

test.describe('Labels', () => {
  let loginPage
  let labelsPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    labelsPage = new LabelsPage(page)
    await loginPage.goto()
    await loginPage.login(userData.username, userData.password)
    await labelsPage.goto()
  })

  // 1. Форма создания отображается
  test('renders create labels form', async () => {
    await labelsPage.createButton.click()
    await expect(labelsPage.nameInput).toBeVisible()
  })

  // 2. Создание новой метки
  test('creates new labels', async () => {
    const newLabels = {
      name: `created-${Date.now()}`,
    }
    await labelsPage.createLabel(newLabels)
    await expect(labelsPage.getLabelRow(newLabels.name)).toBeVisible()
  })

  // 3. Список показывает name
  test('shows labels list with main info', async () => {
    const newLabels = {
      name: `list-${Date.now()}`,
    }
    await labelsPage.createLabel(newLabels)
    // Проверяем заголовки колонок
    await expect(labelsPage.nameColumnHeader).toBeVisible()
    // Проверяем содержимое строки
    const row = labelsPage.getLabelRow(newLabels.name)
    await expect(row).toContainText(newLabels.name)
  })

  // 4. Редактирование
  test('edits label', async () => {
    const newLabel = {
      name: `edit-${Date.now()}`,
    }
    const updatedName = `updated-${Date.now()}`
    await labelsPage.createLabel(newLabel)
    await labelsPage.editLabel(newLabel.name, {
      newName: updatedName,
    })
    const row = labelsPage.getLabelRow(updatedName)
    await expect(row).toContainText(updatedName)
  })

  // 5. Удаление одной метки
  test('deletes label', async () => {
    const newLabel = {
      name: `delete-${Date.now()}`,
    }
    await labelsPage.createLabel(newLabel)
    await expect(labelsPage.getLabelRow(newLabel.name)).toBeVisible()
    await labelsPage.deleteLabel(newLabel.name)
    await expect(labelsPage.getLabelRow(newLabel.name)).not.toBeVisible()
  })

  // 6. Массовое удаление
  test('bulk deletes all labels', async () => {
    await labelsPage.selectAll()
    await expect(labelsPage.selectedCountText).toBeVisible()
    await expect(labelsPage.selectAllCheckbox).toBeChecked()
    await labelsPage.bulkDelete()
    await expect(labelsPage.noLabelsMessage).toBeVisible()
  })
})
