# Access-Based Role Market API

This project implements an **access-based role system** for managing permissions and users in a marketplace-style application. Built with **NestJS**, **Mongoose**, and **JWT authentication**, it also provides **Swagger documentation** for easy API testing.

---

## Key Features

### Role & Permission Seeding

- Default roles and permissions are seeded automatically at application initialization.
- Ensures consistency across environments and development teams.
- Standardizes permissions for all users.

### Swagger API Documentation

- Fully integrated Swagger documentation.
- Accessible at:  <http://localhost:3000/api/docs#/>

- Enables developers to test endpoints and understand API contracts.

### Environment Variables

The application requires the following environment variables:

| Variable | Description |
|----------|-------------|
| `ACCESS_TOKEN_SECRET` | Secret key for signing JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Secret key for signing JWT refresh tokens |
| `DB_URI` | MongoDB connection string |

### JWT Token Pair Authentication

- Users receive **both access and refresh tokens** on login.
- Token pairs reduce the risk of XSS attacks.
- Access tokens are short-lived; refresh tokens allow secure renewal.

---

## Getting Started

1. **Install Dependencies**  

```bash
npm install

- Should have this vars for getting the Api run :

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
DB_URI=mongodb://localhost:27017/temtem-test

- Commend for running Api :

npm run start:dev

- Go to http://localhost:3000/api/docs#/ you will find the swagger docs for doing you tests
