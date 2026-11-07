# Программа лояльности для ритейла

Клиент-серверное приложение управления многоуровневой программой лояльности. Frontend сохранён из исходного проекта; backend — REST API на Spring Boot с PostgreSQL.

## Технологии

- Frontend: React 18, React Router 6, Vite 5, Axios
- Backend: Java 17, Spring Boot 3.4, Spring Data JPA, Validation, springdoc-openapi
- БД: PostgreSQL 16, Flyway
- Тесты: JUnit 5, Spring MockMvc, H2 (профиль `test`)

## Структура

```
src/                 клиентское приложение
src/api/             Axios-модули REST
backend/             Spring Boot
backend/src/main/resources/db/migration/   схема БД
docs/                архитектура, API, принципы, UML
docker-compose.yml   PostgreSQL
```

## Требования

- Node.js 18+
- JDK 17+ (проверено на JDK 23)
- Maven 3.9+
- Docker (для PostgreSQL) либо локальный PostgreSQL 16

## Переменные окружения

Скопируйте `.env.example`. Для клиента достаточно `VITE_API_URL`.

| Переменная | Назначение | Значение по умолчанию |
| --- | --- | --- |
| `VITE_API_URL` | URL backend (не нужен в dev, есть proxy) | `http://127.0.0.1:8090` |
| `DB_URL` | JDBC | `jdbc:postgresql://localhost:5433/loyalty` |
| `DB_USER` / `DB_PASSWORD` | Учётная запись БД | `loyalty` / `loyalty` |
| `CORS_ORIGINS` | Разрешённые origin | `http://localhost:5173` |
| `ADMIN_EMAIL` | Логин менеджера | `i.belova@loyalty.local` |
| `ADMIN_PASSWORD` | Пароль менеджера (не коммитьте боевой) | `demo1234` |

## Запуск одной командой

В корне проекта (PowerShell — с `.\`):

```powershell
.\start.cmd
```

или:

```powershell
npm start
```

Скрипт поднимает PostgreSQL, backend и frontend.  
Остановка: `stop.cmd` или `npm stop`.

- Интерфейс: http://localhost:5173
- API: http://localhost:8090
- Swagger: http://localhost:8090/swagger-ui.html
- Вход: `i.belova@loyalty.local` / `demo1234`

Нужны Docker Desktop (должен быть запущен), JDK, Maven и Node.js.

## Запуск по частям

База:

```bash
docker compose up -d postgres
```

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
npm install
npm run dev
```

При первом старте backend создаёт схему и демонстрационные данные.

## Тесты

```bash
cd backend
mvn test
```

Проверяются CRUD покупателей, уровни, начисление, списание сверх баланса, 400/404/409.
