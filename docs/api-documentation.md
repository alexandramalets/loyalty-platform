# Документация REST API

Интерактивная спецификация: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)  
OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

Базовый URL: `http://localhost:8080/api`  
Формат: JSON. Авторизация: заголовок `Authorization: Bearer <token>` (кроме `/auth/login`).

## Коды ответов

| Код | Когда |
| --- | --- |
| 200 | Успешное чтение или обновление |
| 201 | Создание |
| 204 | Удаление |
| 400 | Ошибка валидации или некорректный JSON |
| 401 | Нет или неверный токен / логин |
| 404 | Сущность не найдена |
| 409 | Конфликт уникальности, недостаток баллов, запрещённая операция |
| 500 | Непредвиденная ошибка сервера |

Пример ошибки:

```json
{
  "timestamp": "2026-11-07T12:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Покупатель не найден: П-000",
  "path": "/api/customers/П-000"
}
```

## Авторизация

### POST /api/auth/login

Вход менеджера.

Запрос:

```json
{ "email": "i.belova@loyalty.local", "password": "demo1234" }
```

Ответ 200:

```json
{
  "token": "uuid",
  "user": {
    "name": "Ирина Белова",
    "initials": "ИБ",
    "role": "Менеджер программы",
    "email": "i.belova@loyalty.local",
    "phone": "+375 29 00 00 000",
    "lastLogin": "07.11.2026 в 15:00",
    "passwordChanged": "12.03.2026"
  }
}
```

Ошибки: 400, 401.

### GET /api/auth/me

Текущий пользователь. 200 / 401.

### POST /api/auth/logout

Завершение сессии. 200 / 401.

## Покупатели

| Метод | URL | Назначение |
| --- | --- | --- |
| GET | `/api/customers` | Список |
| GET | `/api/customers/{id}` | Карточка |
| POST | `/api/customers` | Создание (201) |
| PUT | `/api/customers/{id}` | Обновление |
| DELETE | `/api/customers/{id}` | Удаление (204) |
| GET | `/api/customers/{id}/loyalty-account` | Бонусный счёт |
| GET | `/api/customers/{id}/transactions` | История операций |

Тело создания/обновления:

```json
{
  "firstName": "Анна",
  "lastName": "Ковалёва",
  "phone": "+7 900 111-22-33",
  "email": "anna@loyalty.local",
  "status": "active"
}
```

`status`: `active` | `inactive` | `blocked`. Поля обязательны. Конфликт email/телефона — 409.

Ответ:

```json
{
  "id": "П-104600",
  "firstName": "Анна",
  "lastName": "Ковалёва",
  "name": "Анна Ковалёва",
  "phone": "+7 900 111-22-33",
  "email": "anna@loyalty.local",
  "status": "active",
  "registered": "2026-11-07",
  "levelId": "start",
  "points": 0,
  "purchases": 0,
  "lastActivity": "2026-11-07"
}
```

## Уровни лояльности

| Метод | URL |
| --- | --- |
| GET | `/api/loyalty-levels` |
| GET | `/api/loyalty-levels/{id}` |
| POST | `/api/loyalty-levels` |
| PUT | `/api/loyalty-levels/{id}` |
| DELETE | `/api/loyalty-levels/{id}` |

```json
{
  "name": "Старт",
  "points": 0,
  "percent": 1,
  "color": "#C5D1C3",
  "effectiveFrom": "2024-03-01",
  "description": "Стартовый уровень"
}
```

`points` ≥ 0, `percent` 0–100. Дублирование названия или порога — 409. Удаление используемого уровня — 409.

## Бонусные счета

- GET `/api/loyalty-accounts`
- GET `/api/loyalty-accounts/{id}`
- GET `/api/customers/{id}/loyalty-account`

## Бонусные операции

- GET `/api/transactions`
- GET `/api/transactions/{id}`
- POST `/api/transactions/accrual` (201)
- POST `/api/transactions/write-off` (201)

Начисление:

```json
{
  "customerId": "П-104582",
  "strategy": "FIXED",
  "amount": 200,
  "reason": "Корректировка начисления"
}
```

`strategy`: `FIXED` (нужен `amount`) или `PURCHASE` (нужен `purchaseAmount`).

Списание:

```json
{
  "customerId": "П-104582",
  "amount": 50,
  "reason": "Оплата бонусами"
}
```

Недостаточно баллов или карта заблокирована — 409. Несуществующий покупатель — 404.

## Акции

CRUD `/api/promotions`. `levelId`: код уровня или `all`.

```json
{
  "name": "Дополнительные бонусы",
  "status": "active",
  "levelId": "all",
  "start": "2026-09-01",
  "end": "2026-11-30",
  "bonusPercent": 2,
  "description": "Плюс 2% к базовому начислению"
}
```

`status`: `active` | `scheduled` | `paused` | `finished`.

## Настройки и аналитика

- GET/PUT `/api/settings`
- GET `/api/analytics?period=6` — период в месяцах (1, 3, 6, 12).
