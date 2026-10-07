import { expect } from '@playwright/test'

export default class TasksPage {
  constructor(page) {
    this.page = page

    // Создание / редактирование задачи
    this.createButton = page.getByRole('link', { name: 'Create' })
    this.assigneeSelect = page.getByRole('combobox', { name: 'Assignee' })
    this.titleInput = page.getByRole('textbox', { name: 'Title' })
    this.contentInput = page.getByRole('textbox', { name: 'Content' })
    this.statusSelect = page.getByRole('combobox', { name: 'Status' })
    this.labelSelect = page.getByRole('combobox', { name: 'Label' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })

    // Фильтры
    this.assigneeFilter = page.locator('[data-source="assignee_id"]')
    this.statusFilter = page.locator('[data-source="status_id"]')
    this.labelFilter = page.locator('[data-source="label_id"]')
  }

  // Переход в раздел Tasks
  async goto() {
    await this.page.goto('/#/tasks')
  }

  // Возвращает карточку задачи по title
  getTaskCard(title) {
    return this.page
      .locator('[data-rfd-draggable-id]')
      .filter({ hasText: title })
  }

  // Возвращает колонку по названию статуса
  getColumnByStatus(statusName) {
    return this.page
      .getByRole('heading', {
        name: statusName,
        level: 6,
      })
      .locator('..')
  }

  // Создание задачи
  async createTask({ title, content, assignee, status, labels }) {
    await this.createButton.click()

    if (assignee) {
      await this.assigneeSelect.click()
      await this.page.getByRole('option', { name: assignee }).click()
    }
    if (title) await this.titleInput.fill(title)
    if (status) {
      await this.statusSelect.click()
      await this.page.getByRole('option', { name: status }).click()
    }
    if (content) await this.contentInput.fill(content)
    if (labels?.length) {
      await this.labelSelect.click()
      for (const label of labels) {
        await this.page.getByRole('option', { name: label }).click()
      }
      await this.page.keyboard.press('Escape')
    }

    await expect(this.saveButton).toBeEnabled()
    await this.saveButton.click()

    await this.goto()
  }

  // Редактирование задачи
  async editTask(searchTitle, { title, content, assignee, status, labels }) {
    await this.getTaskCard(searchTitle)
      .getByRole('link', { name: 'Edit' })
      .click()

    await expect(this.titleInput).toHaveValue(searchTitle)

    if (title) await this.titleInput.fill(title)
    if (content) await this.contentInput.fill(content)
    if (assignee) {
      await this.assigneeSelect.click()
      await this.page.getByRole('option', { name: assignee }).click()
    }
    if (status) {
      await this.statusSelect.click()
      await this.page.getByRole('option', { name: status }).click()
    }
    if (labels?.length) {
      await this.labelSelect.click()
      for (const label of labels) {
        await this.page.getByRole('option', { name: label }).click()
      }
      await this.page.keyboard.press('Escape')
    }
    await this.saveButton.click()
  }

  // Удаление задачи
  async deleteTask(title) {
    await this.getTaskCard(title).getByRole('link', { name: 'Edit' }).click()
    await this.deleteButton.click()
    await this.page.waitForURL(/#\/tasks/)
  }

  // Перемещение задачи в другой статус
  async moveTaskToStatus(taskTitle, newStatusName) {
    await this.editTask(taskTitle, {
      status: newStatusName,
    })

    await this.goto()
  }

  // Открывает фильтр и выбирает значение
  async openFilter(field, value) {
    await field.getByRole('combobox').click()
    await this.page.getByRole('option', { name: value }).click()
  }

  // Фильтрация по статусу
  async filterByStatus(statusName) {
    await this.openFilter(this.statusFilter, statusName)
  }

  // Фильтрация по исполнителю
  async filterByAssignee(assigneeName) {
    await this.openFilter(this.assigneeFilter, assigneeName)
  }

  // Фильтрация по метке
  async filterByLabel(labelName) {
    await this.openFilter(this.labelFilter, labelName)
  }
}
