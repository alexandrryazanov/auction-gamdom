# AUCTION APP

## What is implemented
- Custom architecture with services/controllers and OOP principles
- Postgres DB for storing users and lots
- Redis for storing bids (super fast)
- bullMQ for creating queues for every lot
- socket.io for real-time bids updates
- JWT auth with access/refresh tokens
- Body/params/query validation with Joi
- Custom API structure on frontend with react-query (API folder)
- MUI lib interface
- Axios interceptors for auth/not-auth users + invisible token refresh
- Custom hook for interaction with sockets

## What is needed to add
- some spinners/skeletons
- some error handlers/descriptions
- tests
- remake timer (now can be delayed)
- Maybe save all bids in PG in the end of auction for stats

# Backend
## Install and start

Start local PostgreSQL and Redis databases:

```sh
docker compose up
```

Copy env file from .env.example

```sh
cp .env.exsample .env
```

Node version, node modules

Project works on node v22.11.0, but you can try different versions
```sh
npm i
```

Initialise the database:

```sh
npx prisma migrate deploy
```

Seed the database:

```sh
npm run seed
```


Start project in dev mode
```sh
npm run dev
```

# Frontend

## Install and start

Node version, node modules

Project works on node v22.11.0, but you can try different versions
```sh
npm i
```

Start project in dev mode
```sh
npm run dev
```

## Login

You can login on different computers to test auction

Test users from seeding (email/password):
```sh
test1@test.com/12345
test2@test.com/12345
test3@test.com/12345
```

