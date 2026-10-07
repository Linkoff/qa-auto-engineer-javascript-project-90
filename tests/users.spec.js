import { test, expect } from '@playwright/test'
import LoginPage from '../pages/login.page'
import UsersPage from '../pages/users.page'

const userData = {
  username: 'username',
  password: 'password',
}

// serial - тесты идут по очереди, чтобы не мешали друг другу,
// особенно последний тест с массовым удалением
test.describe('Users', () => {
  let loginPage
  let usersPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    usersPage = new UsersPage(page)
    await loginPage.goto()
    await loginPage.login(userData.username, userData.password)
    await usersPage.goto()
  })

  // 1. Форма создания отображается
  test('renders create user form', async () => {
    await usersPage.createButton.click()
    await expect(usersPage.emailInput).toBeVisible()
    await expect(usersPage.firstNameInput).toBeVisible()
    await expect(usersPage.lastNameInput).toBeVisible()
  })

  // 2. Создание нового пользователя
  test('creates new user', async () => {
    const newUser = {
      email: `created-${Date.now()}@example.com`, // уникальный email
      firstName: 'Created',
      lastName: 'User',
    }
    await usersPage.createUser(newUser)
    await expect(usersPage.getUserRow(newUser.email)).toBeVisible()
  })

  // 3. Список показывает email, имя и фамилию
  test('shows users list with main info', async () => {
    const newUser = {
      email: `list-${Date.now()}@example.com`,
      firstName: 'List',
      lastName: 'Check',
    }
    await usersPage.createUser(newUser)
    // Проверяем заголовки колонок
    await expect(usersPage.emailColumnHeader).toBeVisible()
    await expect(usersPage.firstNameColumnHeader).toBeVisible()
    await expect(usersPage.lastNameColumnHeader).toBeVisible()
    // Проверяем содержимое строки
    const row = usersPage.getUserRow(newUser.email)
    await expect(row).toContainText(newUser.email)
    await expect(row).toContainText(newUser.firstName)
    await expect(row).toContainText(newUser.lastName)
  })

  // 4. Редактирование
  test('edits user', async () => {
    const newUser = {
      email: `edit-${Date.now()}@example.com`,
      firstName: 'Before',
      lastName: 'Edit',
    }
    await usersPage.createUser(newUser)
    await usersPage.editUser(newUser.email, {
      firstName: 'After',
      lastName: 'Edited',
    })
    const row = usersPage.getUserRow(newUser.email)
    await expect(row).toContainText('After')
    await expect(row).toContainText('Edited')
  })

  // 5. Редактирования с плохим email
  test('edits user incorrect email', async () => {
    const newUser = {
      email: `edit-${Date.now()}@example.com`,
      firstName: 'Before',
      lastName: 'Edit',
    }
    await usersPage.createUser(newUser)
    await usersPage.editUser(newUser.email, {
      newEmail: 'invalid-email',
    })
    await expect(usersPage.emailError).toBeVisible()
  })

  // 6. Валидация email
  test('shows error for invalid email', async () => {
    await usersPage.createButton.click()
    await usersPage.emailInput.fill('invalid-email')
    await usersPage.firstNameInput.fill('Test')
    await usersPage.lastNameInput.fill('User')
    await usersPage.saveButton.click()
    await expect(usersPage.emailError).toBeVisible()
  })

  // 7. Удаление одного пользователя
  test('deletes user', async () => {
    const newUser = {
      email: `delete-${Date.now()}@example.com`,
      firstName: 'To',
      lastName: 'Delete',
    }
    await usersPage.createUser(newUser)
    await expect(usersPage.getUserRow(newUser.email)).toBeVisible()
    await usersPage.deleteUser(newUser.email)
    await expect(usersPage.getUserRow(newUser.email)).not.toBeVisible()
  })

  // 8. Массовое удаление
  test('bulk deletes all users', async () => {
    await usersPage.selectAll()
    await expect(usersPage.selectedCountText).toBeVisible()
    await expect(usersPage.selectAllCheckbox).toBeChecked()
    await usersPage.bulkDelete()
    await expect(usersPage.noUsersMessage).toBeVisible()
  })
})
