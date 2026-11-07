# SOLID, DRY, KISS и DI

Примеры ниже ссылаются на фактически существующие классы backend.

## S — Single Responsibility

- `CustomerController` принимает HTTP-запросы покупателей.
- `CustomerService` проверяет уникальность почты/телефона и создаёт карточку.
- `CustomerRepository` — доступ к таблице `customer`.
- `GlobalExceptionHandler` единообразно формирует JSON ошибок.
- `CustomerMapper` только преобразует Entity в DTO.

Контроллеры не содержат расчёта баллов и не работают с `JdbcTemplate`.

## O — Open/Closed

Расчёт начисления расширяется новыми реализациями `BonusCalculationStrategy` без правки диспетчера:

- интерфейс `BonusCalculationStrategy`;
- `FixedAmountAccrualStrategy` (`FIXED`);
- `PurchasePercentAccrualStrategy` (`PURCHASE`, учитывает активные акции);
- `BonusCalculationDispatcher` выбирает стратегию по коду.

Новый вид начисления (например, за день рождения) добавляется отдельным `@Component`, реализующим интерфейс.

## L — Liskov Substitution

Все стратегии начисления взаимозаменяемы через `BonusCalculationStrategy`: каждая возвращает неотрицательное целое число баллов или выбрасывает `BadRequestException` при некорректном вводе. Наследование ради демонстрации не вводилось.

`LoyaltyAccountService` реализует `AccountBalanceOperations`. `BonusTransactionService` зависит от интерфейса и остаётся корректным при подмене реализации.

## I — Interface Segregation

- `BonusCalculationStrategy` содержит только `code()` и `calculate()`.
- `AccountBalanceOperations` описывает `credit` и `debit`, без методов отчётов и CRUD покупателей.
- Репозитории разделены по агрегатам, единого «God repository» нет.

## D — Dependency Inversion

Сервисы зависят от абстракций Spring Data и собственных интерфейсов:

```java
public BonusTransactionService(
    BonusTransactionRepository transactions,
    CustomerService customers,
    AccountBalanceOperations balances,
    ...
    BonusCalculationDispatcher calculator
)
```

`PasswordEncoder` объявлен как бин в `SecurityBeans` и внедряется в `AuthService` и `DemoDataLoader`. Объекты не создаются через `new` в контроллерах.

Внедрение — конструкторное (обязательные зависимости `final`).

## DRY

- Разбор дат — `DateMapper`.
- Формирование ответов покупателя и счёта — `CustomerMapper`.
- Поиск сущности или 404 — методы `require(...)` в сервисах.
- Проверка уникальности email/телефона сосредоточена в `CustomerService.ensureUnique`.
- Ошибки API собирает только `GlobalExceptionHandler`.

## KISS

- Нет микросервисов, очередей и CQRS.
- Нет MapStruct/ModelMapper: мапперы — небольшие Spring-компоненты.
- Авторизация — in-memory токен, без JWT-инфраструктуры.
- Аналитика считается SQL-агрегатами по существующим таблицам, отдельное OLAP-хранилище не вводилось.
