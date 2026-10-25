BookVerse

A full-stack online bookstore: a React single-page app backed by an ASP.NET Core Web API and a MySQL database. Customers browse and order books; admins manage the catalogue, users and orders.
Authentication uses JWT, and roles, prices and stock are all enforced on the server, not in the browser.

## Highlights

- **JWT authentication** with hashed passwords. The `admin` and `user` roles are enforced by `[Authorize(Roles = ...)]` on the API, so editing `localStorage` in the browser gets you nowhere.
- **Safe order placement.** The stock check, stock decrement and order record are saved in one transaction, and an EF Core concurrency token stops two buyers taking the last copy.
- **Nothing trusted from the client.** The cart sends only book ids and quantities. Prices come from the database and the username comes from the token.
- **Server-side search and filtering** by title, author, category and genre, with optional paging (`page`, `pageSize`, `X-Total-Count` header).
- **Admin dashboard** for book CRUD, all registered users and all orders.
- **Layered API:** Controllers handle HTTP, Services hold the rules and EF Core queries, and the `DbContext` is used directly.

## Features

**Customers**
- Sign up (validated on both client and server) and log in
- Browse the catalogue and view book details
- Cart that survives a page refresh, quantity limited by available stock
- Place an order, with a clear message if stock changed in the meantime

**Admins**
- Add, edit and delete books
- Search and filter the catalogue
- View every user and every order

  
## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, axios, Yup (form validation), Context API, Bootstrap |
| Backend | ASP.NET Core Web API (.NET 10), Entity Framework Core, JWT bearer authentication, ASP.NET Core Identity `PasswordHasher`, OpenAPI |
| Database | MySQL 8 |
| Tooling | Docker Compose (optional local database), MySQL Workbench |

## Getting started

**Prerequisites:** .NET 10 SDK, Node.js 18 or newer, and MySQL 8 (or Docker).

### 1. Database

Either start MySQL with Docker:

```bash
cd backend
docker compose up -d
```

or, with MySQL already installed, run this once (MySQL Workbench or the `mysql` CLI):

```sql
CREATE DATABASE bookify CHARACTER SET utf8mb4;
CREATE USER 'bookify'@'localhost' IDENTIFIED BY 'bookify_dev_pw';
GRANT ALL PRIVILEGES ON bookify.* TO 'bookify'@'localhost';
```

### 2. API

```bash
cd backend/Bookify.Api
dotnet run          # http://localhost:5080
```

On first run it creates the tables and seeds six books and two demo users. The OpenAPI document is served at `http://localhost:5080/openapi/v1.json` in Development.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5080/api
npm run dev                 # http://localhost:5173
```

### Demo accounts (development seed data only)

| Username | Password | Role |
|---|---|---|
| `admin` | `Admin@123` | admin |
| `reader` | `Reader@123` | user |

### Configuration

| Setting | Where | Purpose |
|---|---|---|
| `ConnectionStrings:Default` | `backend/Bookify.Api/appsettings.json` | MySQL connection |
| `Jwt:Key` | `appsettings.json` (dev placeholder) | Token signing key. Override with `dotnet user-secrets` locally, and an app setting or Key Vault when deployed |
| `Cors:AllowedOrigins` | `appsettings.json` | Frontend origin(s) allowed to call the API |
| `VITE_API_URL` | `frontend/.env` | API base URL used by the React app |

## Project structure

```
bookify/
├── frontend/                  React SPA
│   └── src/
│       ├── api/http.js        axios instance: base URL, JWT header, 401 handling
│       └── components/        pages, dashboards, cart context, route guard
├── backend/
│   ├── docker-compose.yml     optional local MySQL
│   └── Bookify.Api/
│       ├── Controllers/       HTTP only: binding, [Authorize], status codes
│       ├── Services/          rules and queries (Auth, Book, Order) plus token creation
│       ├── Data/              AppDbContext and seed data
│       ├── Models/            EF Core entities
│       └── Dtos/              request and response shapes, with validation rules
└── README.md
```

## API reference

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create a customer account |
| POST | `/api/auth/login` | public | Verify credentials, return `{ token, username, role }` |
| GET | `/api/auth/username-available` | public | Used by the signup form |
| GET | `/api/books` | public | List; `search`, `category`, `genre`, `page`, `pageSize` |
| GET | `/api/books/{id}` | public | Single book |
| POST | `/api/books` | admin | Create a book |
| PUT | `/api/books/{id}` | admin | Update a book |
| DELETE | `/api/books/{id}` | admin | Delete a book |
| POST | `/api/orders` | user | Place an order from `{ items: [{ id, qty }] }` |
| GET | `/api/orders/mine` | user | The current user's orders |
| GET | `/api/orders` | admin | All orders |
| GET | `/api/users` | admin | All users (never includes password hashes) |

Errors come back as `{ "message": "..." }`, which the frontend shows directly.

## Design decisions

| Decision | Why |
|---|---|
| Roles enforced in the API, with `RequireRole` on the frontend only for navigation | Client-side checks can always be bypassed, so the real protection is the server's `[Authorize]` attributes |
| Registration ignores any `role` in the request | Public sign-ups can never create an admin |
| Login returns one message for "unknown user" and "wrong password" | The endpoint can't be used to discover which usernames exist |
| Order lines carry only `id` and `qty` | The server looks up prices, so a modified request can't change what a book costs |
| `StockCount` is an EF Core concurrency token | If two orders touch the same row at once, the second update matches no rows and the API returns 409 instead of overselling |
| Order items store a snapshot of title and price | Later price changes or deleting a book never rewrite order history |
| Column lengths in the DbContext match the DTO validation limits | An over-long title gets a clear 400 instead of a database "data too long" error |
| Services return a small `ServiceResult<T>` instead of throwing | Expected outcomes (not found, conflict) stay out of exception handling, and services never depend on HTTP types |

## Known limitations

- The JWT is kept in `localStorage`, which is exposed to XSS. A production version would use an httpOnly cookie.
- Access tokens only: there is no refresh-token flow, and the app logs out on a 401.
- There are no payments. "Place order" records the order and reduces stock.
- No rate limiting on the login endpoint.
- The development JWT key and demo credentials are placeholders and must be replaced outside local development.

## Roadmap

- [ ] xUnit tests for the order and stock rules
- [ ] EF Core migrations in place of `EnsureCreated()`
- [ ] Foreign key from `Orders` to `Users`
- [ ] Pager in the admin and catalogue lists (the API already supports it)
- [ ] Customer order-history page (`GET /api/orders/mine` exists)
- [ ] Deploy to Azure: App Service, Azure Database for MySQL, Static Web Apps
- [ ] CI with GitHub Actions

## Author

[Priyadharshini Ravichandran] · [www.linkedin.com/in/priyadharshini21295] · [https://github.com/Priyadharshini21295]

