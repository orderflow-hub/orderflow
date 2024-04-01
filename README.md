# OrderFlow Application

Welcome to the OrderFlow Application - a comprehensive solution for managing orders, products, and users efficiently. This application streamlines the order management process, making it easy for administrators and customers alike to keep track of orders, products availability, and user accounts.

## Features

- **User Management**: Create, update, and manage user profiles, including role-based access control.
- **Product Catalogue**: Easily add, update, and manage products along with their availability status.
- **Order Processing**: Streamlined process for placing, updating, and tracking orders.
- **Dynamic Reporting**: Generate reports on orders, users, and product sales to gain insights into business operations.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)
- Any modern web browser.

### Installing

A step by step series of examples that tell you how to get a development environment running.

1. Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/orderflow.git
```

2. Install the dependencies:

```bash
git npm install
```

3. Set up your environment variables:

```bash
git cp .env.example .env
```

4. Initialize the database:
   Make sure PostgreSQL is running and execute the initialization script located in scripts/init_db.sql to create the necessary database and tables.

5. Start the application:

```bash
npm run dev -- --host
```

Access the application through http://localhost:3000.

## Built With

SvelteKit - The web framework used
PostgreSQL - Database
Firebase - Authentication and storage

## Authors

- **CVakratsas** - [CVakratsas](https://github.com/CVakratsas)
- **NikolasPpd** - [NikolasPpd](https://github.com/NikolasPpd)
