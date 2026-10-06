import { expect } from '@playwright/test'
export default class LabelsPage {
  constructor(page) {
    this.page = page

    // Список меток
    this.createButton = page.getByRole('link', { name: 'Create' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.selectedCountText = page.getByText(/[1-9]\d* items selected/)
    this.noLabelsMessage = page.getByText('No Labels yet.')
    this.nameColumnHeader = page.getByRole('columnheader', { name: 'Name' })

    // Форма создания/редактирования
    this.nameInput = page.getByRole('textbox', { name: 'Name' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
  }

  // Переход в раздел Labels
  async goto() {
    await this.page.goto('/#/labels')
  }

  // Возвращает строку таблицы по name
  // filter({ hasText }) оставляет только ту строку, где есть нужный текст
  getLabelRow(name) {
    return this.page.getByRole('row').filter({ hasText: name })
  }

  // Создание метки: открыть форму, заполнить поле, сохранить
  async createLabel({ name }) {
    await this.createButton.click()
    await this.nameInput.fill(name)
    await this.saveButton.click()
    await this.goto()
  }

  // Редактирование: клик по строке открывает форму,
  // затем меняем поле и сохраняем
  async editLabel(searchName, { newName }) {
    await this.getLabelRow(searchName).click()
    // Ждем именно старое значение, а не 'просто непустое'
    await expect(this.nameInput).toHaveValue(searchName)

    if (newName) {
      await this.nameInput.clear()
      await this.nameInput.pressSequentially(newName)
    }

    // Явная проверка, что Save активировалась (форма стала dirty)
    await expect(this.saveButton).toBeEnabled()
    await this.saveButton.click()
  }

  // Удаление одного: открыть форму, нажать Delete
  async deleteLabel(name) {
    await this.getLabelRow(name).click()
    await this.deleteButton.click()
  }

  // Массовое удаление: выбрать все и нажать Delete в bulk toolbar
  async selectAll() {
    await this.selectAllCheckbox.check()
  }

  async bulkDelete() {
    await this.deleteButton.click()
  }
}
