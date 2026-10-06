import { expect } from '@playwright/test'
export default class UsersPage {
  constructor(page) {
    this.page = page

    // Список пользователей
    this.usersMenuItem = page.getByRole('menuitem', { name: 'Users' })
    this.createButton = page.getByRole('link', { name: 'Create' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.selectedCountText = page.getByText(/[1-9]\d* items selected/)
    this.noUsersMessage = page.getByText('No Users yet.')
    this.emailColumnHeader = page.getByRole('columnheader', { name: 'Email' })
    this.firstNameColumnHeader = page.getByRole('columnheader', {
      name: 'First name',
    })
    this.lastNameColumnHeader = page.getByRole('columnheader', {
      name: 'Last name',
    })

    // Форма создания/редактирования
    this.emailInput = page.getByRole('textbox', { name: 'Email' })
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' })
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })

    // Ошибки валидации
    this.emailError = page.getByText('Incorrect email format')
  }

  // Переход в раздел Users
  async goto() {
    await this.page.goto('/#/users')
  }

  // Возвращает строку таблицы по email
  // filter({ hasText }) оставляет только ту строку, где есть нужный текст
  getUserRow(email) {
    return this.page.getByRole('row').filter({ hasText: email })
  }

  // Создание пользователя: открыть форму, заполнить поля, сохранить
  async createUser({ email, firstName, lastName }) {
    await this.createButton.click()
    await this.emailInput.fill(email)
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.saveButton.click()
    await this.goto()
  }

  // Редактирование: клик по строке открывает форму,
  // затем меняем поля и сохраняем
  async editUser(searchEmail, { newEmail, firstName, lastName }) {
    await this.getUserRow(searchEmail).click()
    // Ждем, что форма загрузила имя и фамилию (не пустые)
    await expect(this.firstNameInput).not.toHaveValue('')
    await expect(this.lastNameInput).not.toHaveValue('')
    if (newEmail) await this.emailInput.fill(newEmail)
    if (firstName) await this.firstNameInput.fill(firstName)
    if (lastName) await this.lastNameInput.fill(lastName)
    await this.saveButton.click()
  }

  // Удаление одного: открыть форму, нажать Delete
  async deleteUser(email) {
    await this.getUserRow(email).click()
    await this.deleteButton.click()
  }

  // Массовое удаление: выбрать всех и нажать Delete в bulk toolbar
  async selectAll() {
    await this.selectAllCheckbox.check()
  }

  async bulkDelete() {
    await this.deleteButton.click()
  }
}
