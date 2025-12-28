## Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/sserebrinka/avito_test.git
cd avito_test
```

2. Установите зависимости:

```bash
npm install
```

## Запуск тестов

| Скрипт                | Описание                                         |
| --------------------- | ------------------------------------------------ |
| `npm test`            | Запуск всех тестов в headless режиме             |
| `npm run test:headed` | Запуск тестов с видимым браузером                |
| `npm run test:ui`     | Запуск тестов в режиме Playwright Test Runner UI |
