# 📖 Minimalist Book Manager API

## Introduction

This is the starter repository for the Further APIs session. It provides a start to creating a Minimalist Book Manager API.

### Pre-Requisites

- NodeJS installed (v18.12.1 Long Term Support version at time of writing)

### Technologies & Dependencies

- [TypeScript](https://www.typescriptlang.org/)
- [ExpressJS](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [SQLite3](https://www.npmjs.com/package/sqlite3)
- [Jest](https://jestjs.io/)
- [Supertest](https://www.npmjs.com/package/supertest)
- [ESLint](https://eslint.org/)
- [pg](https://www.npmjs.com/package/pg)
- [dotenv](https://www.npmjs.com/package/dotenv)

### How to Get Started

- Fork this repo to your Github and then clone the forked version of this repo

### Running the application

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm start
```

### Running the Unit Tests

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm test
```

### Setting up wit Postgres

Follow the guidelines in the docs folder <docs/API Lab 2 - TS - Postgres (3).pdf>

### Tasks worked on

📘 Task 1: Implemented the following User Story with tests.

`User Story: As a user, I want to use the Book Manager API to delete a book using its ID`

📘 Extension Task: Added missing tests for PUT endoing point and non-happy path tests for other tests. These cover:

- Checking if a book ID exists and if not to return an error message with appropriate status code for an endpoint.
- Checking invalid URLS return
