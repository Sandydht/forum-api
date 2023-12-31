# Forum API
This project was created with [Hapi Framework](https://hapi.dev/)

## Table of Contents
* [How to Setup](#how-to-setup)
* [How to Run](#how-to-run)
* [Libraries](#libraries)
* [Must to Know](#must-to-know)

## How to Setup
* Install nvm to install npm and node with management version
* Install the package
  - ` $ npm install `
* Setup .env (please contact me)
* Migrate up database table
  - ` $ npm run migrate up`
  - ` $ npm run migrate:test up`

## How to Run
* Test watch
  - ` $ npm run test:watch `
* Test
  - ` $ npm run test `
* Development
  - ` $ npm run start:dev `
* Production
  - ` $ npm run start `

## Libraries
* Encription hashing with [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)
* Encription token with [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme)
* Continues local development with [Nodemon](https://nodemon.io/)
* Database storage with [postresql](https://www.postgresql.org/)
* Database migration management with [node-pg-migrate](https://github.com/salsita/node-pg-migrate)

## Must to Know
* Use permanent version package for dependencies. 
* Use indent Spaces: 2
