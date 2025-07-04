# BrainPop Backend Server

This is the backend server for the BrainPop application. It provides API endpoints for user authentication, explorer items, and more.

## Setup

1. Make sure you have Node.js and npm installed.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root of the Backend directory with the following content:
   ```
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
   ```
   Replace the connection string with your PostgreSQL database connection details if different.

## Database Migrations

The application uses PostgreSQL for data storage. To set up the database tables, run:

```
npm run migrate
```

This will create the following tables:
- `users` - Stores user information
- `sets` - Stores flashcard sets
- `cards` - Stores flashcards
- `explorer_items` - Stores the explorer structure (folders and sets)

## Running the Server

To run the server in development mode with automatic reloading:

```
npm run dev
```

To run the server in production mode:

```
npm run start
```

The server will be available at http://localhost:3000 (or the port specified in the PORT environment variable).

## API Endpoints

### Explorer Endpoints

- `GET /explorer/:userId` - Get all explorer items for a user
- `POST /explorer/item` - Create a new explorer item
- `PUT /explorer/item/:id` - Update an explorer item
- `DELETE /explorer/item/:id` - Delete an explorer item
- `POST /explorer/structure/:userId` - Save the entire explorer structure for a user

### User Endpoints

- `POST /register` - Register a new user
- `POST /login` - Login a user
