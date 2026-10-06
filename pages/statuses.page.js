import { expect } from '@playwright/test'
export default class StatusesPage {
  constructor(page) {
    this.page = page

    // Список статусов
    this.createButton = page.getByRole('link', { name: 'Create' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.selectedCountText = page.getByText(/[1-9]\d* items selected/)
    this.noStatusesMessage = page.getByText('No Task statuses yet.')
    this.nameColumnHeader = page.getByRole('columnheader', { name: 'Name' })
    this.slugColumnHeader = page.getByRole('columnheader', { name: 'Slug' })

    // Форма создания/редактирования
    this.nameInput = page.getByRole('textbox', { name: 'Name' })
    this.slugInput = page.getByRole('textbox', { name: 'Slug' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
  }

  // Переход в раздел Task statuses
  async goto() {
    await this.page.goto('/#/task_statuses')
  }

  // Возвращает строку таблицы по name
  // filter({ hasText }) оставляет только ту строку, где есть нужный текст
  getStatusRow(name) {
    return this.page.getByRole('row').filter({ hasText: name })
  }

  // Создание статуса: открыть форму, заполнить поля, сохранить
  async createStatus({ name, slug }) {
    await this.createButton.click()
    await this.nameInput.fill(name)
    await this.slugInput.fill(slug)
    await this.saveButton.click()
    await this.goto()
  }

  // Редактирование: клик по строке открывает форму,
  // затем меняем поля и сохраняем
  async editStatus(searchName, { newName, slug }) {
    await this.getStatusRow(searchName).click()
    // Ждем, что форма загрузила Name и Slug (не пустые)
    await expect(this.nameInput).not.toHaveValue('')
    await expect(this.slugInput).not.toHaveValue('')
    if (newName) await this.nameInput.fill(newName)
    if (slug) await this.slugInput.fill(slug)
    await this.saveButton.click()
  }

  // Удаление одного: открыть форму, нажать Delete
  async deleteStatus(name) {
    await this.getStatusRow(name).click()
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
