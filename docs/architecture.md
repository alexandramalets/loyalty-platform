# Архитектура backend

Серверная часть реализована на **Java 17 / Spring Boot 3.4** в архитектурном стиле REST. Клиент — существующее React-приложение. Данные хранятся в **PostgreSQL 16**.

## Компоненты

- **Клиент** (`src/`) — Vite + React 18. Обращается к API через Axios-модули в `src/api`.
- **REST API** (`backend/`) — Spring MVC, порт `8080`.
- **БД** — PostgreSQL, схема создаётся Flyway-миграцией `V1__init.sql`. Демонстрационные данные загружает `DemoDataLoader`.

## Слои

| Слой | Пакет | Ответственность |
| --- | --- | --- |
| Controller | `com.retail.loyalty.controller` | HTTP, статус-коды, валидация DTO |
| Service | `com.retail.loyalty.service` | бизнес-правила, транзакции |
| Strategy | `com.retail.loyalty.service.strategy` | расчёт начисления (OCP) |
| Repository | `com.retail.loyalty.repository` | доступ к данным (Spring Data JPA) |
| Entity | `com.retail.loyalty.domain` | модель БД |
| DTO | `com.retail.loyalty.dto` | JSON-контракт |
| Mapper | `com.retail.loyalty.mapper` | Entity ↔ DTO |
| Exception | `com.retail.loyalty.exception` | единый JSON ошибок |
| Config | `com.retail.loyalty.config` | CORS, OpenAPI, свойства |
| Security | `com.retail.loyalty.security` | токены сессии |

Зависимости внедряются через конструкторы (DI). Контроллеры не содержат бизнес-логики и не создают сервисы через `new`.

## Модель данных

Сущности соответствуют фактическому frontend. Отдельные `Product`, `Purchase` и `Reward` не введены: в интерфейсе нет каталога товаров и витрины вознаграждений. Покупки хранятся как счётчик на бонусном счёте.

- `LoyaltyLevel` 1—* `LoyaltyAccount` — порог баллов и процент начисления.
- `Customer` 1—1 `LoyaltyAccount` — баллы, покупки, текущий уровень.
- `Customer` 1—* `BonusTransaction` — начисление/списание.
- `LoyaltyLevel` 0—* `Promotion` (`level_id` NULL = все уровни).
- `LevelTransition` — журнал смены уровня.
- `ProgramSettings` — параметры программы (одна запись).
- `StaffUser` — учётная запись менеджера.

## Бизнес-правила

- Новый покупатель получает счёт на уровне с порогом 0.
- Начисление: стратегии `FIXED` и `PURCHASE` (процент уровня + активные акции).
- Списание нельзя выполнить на сумму больше остатка (HTTP 409).
- Операции по статусу `blocked` запрещены.
- После изменения баланса уровень пересчитывается по порогам.
- Удаление уровня запрещено, если на него ссылаются счета или акции.

## Безопасность

`POST /api/auth/login` выдаёт opaque-токен. Остальные `/api/**` требуют `Authorization: Bearer`. Swagger и OpenAPI открыты без токена. Пароль администратора задаётся переменной `ADMIN_PASSWORD` и хранится как BCrypt-хеш.
