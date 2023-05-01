# Getting started:

[Front-end](https://github.com/Horos20/rest-api-crud-operations).

## Setting up backend:

1. Clone this project
2. Install dependencies
```
   npm i
```
3. Install postgresql
4. Create database in postgresql and change .env file to connect your database.
```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```
5. Migrate database changes
```
   npx prisma migrate dev
```
6. Start the server
```
   npm start
```
7. Server started at
```
   http://localhost:8080/
```