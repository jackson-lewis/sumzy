This project is called Sumzy, a web app for finance management and tracking. It supports multiple users.

This project is built with Next.js 16, using the App Router, ShadCN and Tailwind. Database connection uses Prisma and PostgreSQL.

Structure of the app:

## Transactions
These are the financial transactions recorded by the user, including income and expenses. If the `amount` is greater than zero, it represents income; if less than zero, it represents an expense.

Categories and merchants are assigned to transactions.

Subscriptions are used to automate transactions which are reoccurring, such as monthly bills or salary payments. The subscription model is the same as transactions, but with additional fields for frequency. A subscription can only be created from an existing transaction.

## Reporting
Reports, in the form of data tables and charts, provide a visual way to present financial information and trends. It reads the transactions, and groups or filters then by parameters such as category and date.