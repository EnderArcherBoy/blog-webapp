# Blog Project

A modern, full-stack blog application built with Next.js and optimized for performance.

## Project Structure

The project is organized into two main directories:

- `blog-frontend/`: Next.js-based frontend application
- `blog-backend/`: Backend application

## Frontend Features

- Modern UI with responsive design
- Next.js Image optimization
- Team section with member profiles
- Blog post management
- SEO optimized
- Performance optimized with Core Web Vitals in mind

## Getting Started

### Prerequisites

1. Install [XAMPP](https://www.apachefriends.org/download.html)
   - Required for MySQL database
   - Minimum version: 8.0
   - Make sure Apache and MySQL services are running

2. Install Node.js (version 16 or higher)
3. Install npm (usually comes with Node.js)

### Database Setup

1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Create a new database:
   ```sql
   CREATE DATABASE blog_db;
   ```

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd blog-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Prisma:
   ```bash
   # Install Prisma CLI globally
   npm install -g prisma

   # Initialize Prisma in your project
   npx prisma init

   # Update .env file with your database URL
   DATABASE_URL="mysql://root:@localhost:3306/blog_db"
   ```

4. Create and apply database migrations:
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init
   ```

5. Seed the database (if available):
   ```bash
   npx prisma db seed
   ```

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd blog-frontend
   npm install

   # Backend
   cd ../blog-backend
   npm install
   ```
3. Run the development servers:
   ```bash
   # Frontend
   cd blog-frontend
   npm run dev

   # Backend
   cd ../blog-backend
   npm run dev
   ```

## Technologies Used

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- next/image for optimized images

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL (via XAMPP)
- TypeScript
- Database (MongoDB/PostgreSQL)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/blog-project](https://github.com/yourusername/blog-project)
