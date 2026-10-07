import { test, expect } from '@playwright/test'

import LoginPage from '../pages/login.page'
import TasksPage from '../pages/tasks.page'

const userData = {
  username: 'username',
  password: 'password',
}

const SEED_USER_EMAIL = 'john@google.com'

test.describe('Tasks', () => {
  let loginPage
  let tasksPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    tasksPage = new TasksPage(page)

    await loginPage.goto()
    await loginPage.login(userData.username, userData.password)
    await tasksPage.goto()
  })

  // 1. Форма создания отображается
  test('renders create task form', async () => {
    await tasksPage.createButton.click()

    await expect(tasksPage.assigneeSelect).toBeVisible()
    await expect(tasksPage.titleInput).toBeVisible()
    await expect(tasksPage.contentInput).toBeVisible()
    await expect(tasksPage.statusSelect).toBeVisible()
    await expect(tasksPage.labelSelect).toBeVisible()
  })

  // 2. Создание новой задачи
  test('creates new task', async () => {
    const timestamp = Date.now()

    const newTask = {
      title: `Task-${timestamp}`,
      content: `Description for task ${timestamp}`,
      assignee: SEED_USER_EMAIL,
      status: 'Draft',
      labels: ['bug', 'feature'],
    }

    await tasksPage.createTask(newTask)
    await expect(tasksPage.getTaskCard(newTask.title)).toBeVisible()
  })

  // 3. Доска показывает все колонки статусов
  test('shows tasks board with columns', async () => {
    const statuses = [
      'Draft',
      'To Review',
      'To Be Fixed',
      'To Publish',
      'Published',
    ]

    for (const status of statuses) {
      await expect(tasksPage.getColumnByStatus(status)).toBeVisible()
    }
  })

  // 4. Редактирование задачи
  test('edits task', async () => {
    const timestamp = Date.now()

    const task = {
      title: `Edit-Task-${timestamp}`,
      content: 'Original description',
      assignee: SEED_USER_EMAIL,
      status: 'Draft',
      labels: ['bug'],
    }

    const newTitle = `Updated-Task-${timestamp}`
    const newContent = 'Updated description'

    await tasksPage.createTask(task)

    await tasksPage.editTask(task.title, {
      title: newTitle,
      content: newContent,
      labels: ['feature', 'enhancement'],
    })

    await tasksPage.goto()
    await expect(tasksPage.getTaskCard(task.title)).not.toBeVisible()
    await expect(tasksPage.getTaskCard(newTitle)).toBeVisible()
  })

  // 5. Перемещение задачи в другой статус
  test('moves task to another status via edit', async () => {
    const timestamp = Date.now()

    const task = {
      title: `Move-Task-${timestamp}`,
      content: 'Task to be moved',
      assignee: SEED_USER_EMAIL,
      status: 'Draft',
      labels: ['task'],
    }

    await tasksPage.createTask(task)
    await expect(tasksPage.getColumnByStatus('Draft')).toContainText(task.title)
    await tasksPage.moveTaskToStatus(task.title, 'To Review')
    await expect(tasksPage.getColumnByStatus('To Review')).toContainText(
      task.title,
    )
    await expect(tasksPage.getColumnByStatus('Draft')).not.toContainText(
      task.title,
    )
  })

  // 6. Фильтрация задач по исполнителю
  test('filters tasks by assignee', async () => {
    const timestamp = Date.now()

    const task1 = {
      title: `AssigneeFilter-1-${timestamp}`,
      content: 'Task assigned to John',
      assignee: 'john@google.com',
      status: 'Draft',
      labels: ['bug'],
    }

    const task2 = {
      title: `AssigneeFilter-2-${timestamp}`,
      content: 'Task assigned to Jack',
      assignee: 'jack@yahoo.com',
      status: 'Draft',
      labels: ['feature'],
    }

    await tasksPage.createTask(task1)
    await tasksPage.createTask(task2)
    await tasksPage.filterByAssignee(task1.assignee)
    await expect(tasksPage.getTaskCard(task1.title)).toBeVisible()
    await expect(tasksPage.getTaskCard(task2.title)).not.toBeVisible()
  })

  // 7. Фильтрация задач по статусу
  test('filters tasks by status', async () => {
    const timestamp = Date.now()

    const task1 = {
      title: `Filter-1-${timestamp}`,
      assignee: SEED_USER_EMAIL,
      status: 'Draft',
      labels: ['bug'],
    }

    const task2 = {
      title: `Filter-2-${timestamp}`,
      assignee: SEED_USER_EMAIL,
      status: 'To Review',
      labels: ['feature'],
    }

    await tasksPage.createTask(task1)
    await tasksPage.createTask(task2)
    await tasksPage.filterByStatus(task1.status)
    await expect(tasksPage.getTaskCard(task1.title)).toBeVisible()
    await expect(tasksPage.getTaskCard(task2.title)).not.toBeVisible()
  })

  // 8. Фильтрация задач по метке
  test('filters tasks by label', async () => {
    const timestamp = Date.now()

    const task1 = {
      title: `LabelFilter-1-${timestamp}`,
      assignee: SEED_USER_EMAIL,
      status: 'Draft',
      labels: ['bug'],
    }

    const task2 = {
      title: `LabelFilter-2-${timestamp}`,
      assignee: SEED_USER_EMAIL,
      status: 'Draft',
      labels: ['feature'],
    }

    await tasksPage.createTask(task1)
    await tasksPage.createTask(task2)
    await tasksPage.filterByLabel('bug')
    await expect(tasksPage.getTaskCard(task1.title)).toBeVisible()
    await expect(tasksPage.getTaskCard(task2.title)).not.toBeVisible()
  })

  // 9. Удаление задачи
  test('deletes task', async () => {
    const timestamp = Date.now()

    const task = {
      title: `Delete-Task-${timestamp}`,
      assignee: SEED_USER_EMAIL,
      status: 'Draft',
      labels: ['critical'],
    }

    await tasksPage.createTask(task)
    await expect(tasksPage.getTaskCard(task.title)).toBeVisible()
    await tasksPage.deleteTask(task.title)
    await expect(tasksPage.getTaskCard(task.title)).not.toBeVisible()
  })
})
