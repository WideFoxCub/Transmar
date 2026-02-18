\# Transmar - Recruitment Task



Solution contains:

\- \*\*Transmar.Api\*\* (ASP.NET Core Web API, EF Core, SQL Server)

\- \*\*transmar-web\*\* (Angular, proxy to API)



\## Requirements

\- SQL Server Express + SSMS

\- .NET SDK (installed)

\- Node.js LTS + npm

\- Angular CLI (`npm i -g @angular/cli`)



\## Database

Restore provided backup `Transmar.bak` (or use your restored database) and ensure it is accessible from API connection string.



\## Backend (Transmar.Api)

1\. Open solution in Visual Studio.

2\. Set `Transmar.Api` as Startup Project.

3\. Check connection string in `appsettings.json` (Server/Database).

4\. Run (F5).



API is available on:

\- `https://localhost:7057`

\- Swagger: `https://localhost:7057/swagger`



\### Authentication

Login endpoint:

\- `POST /api/auth/login`

Body:

```json

{ "username": "admin", "password": "admin" }



WEB is available on:

ng serve -o --proxy-config proxy.conf.json

