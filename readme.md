# Employee Management System

A RESTful API for managing employee data using Node.js, Express, and PostgreSQL.

## Architecture

This project follows the MVC (Model-View-Controller) architecture:

- **Models**: Handle data structure and database operations
- **Controllers**: Manage business logic and request handling
- **Routes**: Define API endpoints and connect them to controllers

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (Node Package Manager)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=employee_db
```

4. Initialize the database:
```bash
psql -U postgres -f init.sql
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. The API will be available at `http://localhost:3000`

## API Endpoints

### Employees

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Request Body Format

For POST and PUT requests:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 404: Not Found
- 500: Server Error

## Development

This project uses:
- Express.js for the web framework
- PostgreSQL for the database
- dotenv for environment variables
- cors for Cross-Origin Resource Sharing