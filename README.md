# Student Management System

A backend-focused Student Management System built using **Node.js, Express.js, TypeScript and MongoDB**. The application provides structured management of students, courses and course enrollments through a REST API.

The project follows a layered architecture, separating routes, controllers, services, repositories, models and interfaces to keep business logic organised and maintainable.

## Features

### Student Management
- Create student records
- Retrieve student information
- Update student details
- Delete student records

### Course Management
- Create and manage courses
- Retrieve course information
- Update course details
- Delete courses

### Enrollment Management
- Enroll students in courses
- Retrieve enrollment records
- Manage student-course relationships

### Backend Architecture
- TypeScript for static typing
- Layered application structure
- Repository pattern for data access
- Service layer for business logic
- Interfaces for defining data contracts
- MongoDB integration using Mongoose

## Technology Stack

| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB |
| ODM | Mongoose |
| Validation | Validator.js |
| Development | TSX |
| Frontend Notifications | SweetAlert2 |

## Project Structure

```text
student-management-system/
│
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
│
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   ├── student.controller.ts
│   │   ├── course.controller.ts
│   │   └── enrollment.controller.ts
│   │
│   ├── interfaces/
│   │
│   ├── models/
│   │
│   ├── repositories/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   └── app.ts
│
├── .env.example
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### 1. Clone the Repository

```bash
git clone https://github.com/ashwinmuralinair2002/student-management-system.git
```

### 2. Navigate to the Project

```bash
cd student-management-system
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
MONGO_URI=mongodb://127.0.0.1:27017/student_management
PORT=3000
```

You can also refer to the provided `.env.example` file.

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

To build the TypeScript project:

```bash
npm run build
```

To start the application:

```bash
npm start
```

## Architecture

The application follows a layered architecture:

**Routes → Controllers → Services → Repositories → Models**

- **Routes:** Define API endpoints.
- **Controllers:** Handle incoming requests and responses.
- **Services:** Contain application business logic.
- **Repositories:** Handle database access.
- **Models:** Define MongoDB data structures using Mongoose.
- **Interfaces:** Define TypeScript contracts for application entities and repositories.

This separation helps keep the application organised and makes individual layers easier to maintain.

## Author

**Ashwin Murali Nair**

- GitHub: [@ashwinmuralinair2002](https://github.com/ashwinmuralinair2002)

## License

This project is licensed under the ISC License.
