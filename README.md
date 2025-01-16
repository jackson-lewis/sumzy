# Sumzy - Personal Finance Tracker

This purpose of this project was to further my skills in TypeScript, Node.js and AWS where I would actually make use of the project long-term. For many yeasr, I've kpet track of my finance in a spreadsheet. While it works, I've always wanted to quickly find out information such as averages, or comparisons on previous months etc, and develeping this project has allowed me to do that.

Here's the features of the app:

- Sign up process
  - Pasword validator
  - Email verification step
- Log in process
- Forgot your password
- Update account information (name, email)
- Create transaction categories
- Default transaction categories provided
- Create a transaction, inputting income/expense, amount, category, date
- Update a transaction (cannot change type eg income/expense)
- Delete a transaction
- Generate monthly report
  - Generate on transaction create/update/delete
  - Calculate sum of all transactions, split into categories and total amounts of income, expense and surplus
  - Calculate a comparison of totals, compare against previous month and year-over-year

In this repo, all services are contained within this Next.js application. The reason this adaptation exists is due to costs associated with running Sumzy with a microservice architecture on AWS, whereas this monolithic architecture is hosted for free on Vercel and Supabase.

For more information about the microservice architecture on AWS, check out the [readme](https://github.com/jackson-lewis/sumzy-microservices#readme).

## Technical Breakdown

Here's a comprehensive look into the tech stack, excludes AWS.

### Framework: Next.js

I've used Next.js on countless projects so this was a no brainer. However with both Next.js 15 and React 19 released just a few months prior, I took the opportunity to ensure I was using as many of the latest features as possible.

This list covers both Next.js and React features:

- Route Groups - keep the marketing site and dashboard seperate
- `<Form />`
- Server Actions
- Middleware - ensure non-authenticated requests cannot access dashboard
- Route Handlers

#### Server-side validation

To validate user input on the server, I've used [zod](https://www.npmjs.com/package/zod) for the first time. I've had previous exposure to it, having seen it in numerous Next.js examples.

### Database: PostgreSQL with Prisma

Both PostgreSQL and Prisma were new to me on this project. I had previous experience with MySQL, MongoDB and Firestore.

I made use of:

- Prisma migrations
- PostgreSQL foreign keys

### Data Fetching

#### Client-side

For the first time, I gave SWR a go. Worked very well and made good use of the features. I wrapped almost all uses in my own hook such as `useUser()`, `useTx()` and `useReport()`

- Mutate
- `useOptimistic()`

#### Server-side

As data is stored in a PostgreSQL database, I used Prisma to query data directly frmo the database.

### Authentication: Jose

> While it is best practise to use auth libraries such as Auth.js, I wanted hands-on experience creating an authentication setup.

I followed the Next.js guide on [stateless session management](https://nextjs.org/docs/app/building-your-application/authentication#stateless-sessions), where I discovered the [jose](https://www.npmjs.com/package/jose) npm package. I was previously using the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package.

Used the Next.js cookies API to set and get the session.

### Containerisation: Docker

I've vageuly used Docker in the past, it's always been installed on my laptop, but I really wanted to use it in this project.

While the full usage of Docker is primarily used for the microservice architecture, it is still uesd in this monolithic repo so there can be a local PostgreSQL database.

- Docker Compose to define database container
- Dockerfile to initiate Prisma and start Next.js dev server

### Communication: RabbitMQ

> Only used in the microservice architecture

Another new technology I was eager to gain experience with. I made used multiple queues for various services such as user events and transaction events.
