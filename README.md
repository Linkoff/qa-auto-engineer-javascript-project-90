# Тестирование Канбан-доски (JS)

[![hexlet-check](https://github.com/Linkoff/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Linkoff/qa-auto-engineer-javascript-project-90/actions)

Автоматизированное тестирование веб-приложения "Канбан-доска" с помощью JavaScript и Playwright.

Учебный проект Хекслета: https://ru.hexlet.io/programs/qa-auto-engineer-javascript

## Стек

- JavaScript
- Playwright
- React
- Vite
- ESLint

## Что тестируется

Автоматизированные тесты проверяют основные сценарии работы приложения:

- авторизация и выход из аккаунта;
- создание, просмотр, редактирование и удаление пользователей;
- управление статусами задач;
- управление метками;
- создание, редактирование и удаление задач;
- фильтрация задач и перемещение между статусами.

Для организации тестового кода используется паттерн Page Object.

## Установка

Клонируйте репозиторий и перейдите в каталог проекта:

```bash
git clone https://github.com/Linkoff/qa-auto-engineer-javascript-project-90.git
cd qa-auto-engineer-javascript-project-90
```

Установите зависимости:

```bash
npm install
```

## Запуск тестов

Запустить все автоматизированные тесты:

```bash
make test
```

Проверить код с помощью ESLint:

```bash
make lint
```

Также команды можно выполнить напрямую:

```bash
npx playwright test
npm run lint
```

Для запуска тестов Playwright автоматически запускает приложение через Vite, используя настройки playwright.config.js.

## Ручной запуск приложения

Для запуска приложения отдельно от тестов выполните:

```bash
npm run dev
```

После запуска Vite откройте адрес, указанный в терминале. По умолчанию в конфигурации Playwright используется http://localhost:5173.
