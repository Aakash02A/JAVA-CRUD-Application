# Student Management System

A full-stack CRUD application with login/registration, built with:

- **Backend:** Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security (password hashing only)
- **Frontend:** HTML, CSS, vanilla JavaScript (Fetch API)
- **Database:** MySQL

## 1. Prerequisites

- JDK 17+
- Maven 3.8+ (or use your IDE's built-in Maven)
- MySQL 8+ running locally

## 2. Create the database

You don't strictly have to run this yourself — `createDatabaseIfNotExist=true` in
`application.properties` will create it automatically. But if you'd rather do it manually:

```sql
CREATE DATABASE IF NOT EXISTS student_management_db;
```

Hibernate (`spring.jpa.hibernate.ddl-auto=update`) will create the `users` and `students`
tables automatically the first time you run the app.

## 3. Configure your MySQL credentials

Credentials should not be committed. Create `application-local.properties` in the project root
(it is excluded by `.gitignore`) and add your local MySQL settings:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

Alternatively, set the `DB_USERNAME` and `DB_PASSWORD` environment variables.
`src/main/resources/application.properties` contains no database password.

## 4. Run the backend

From the project root:

```bash
mvn spring-boot:run
```

The app starts on **http://localhost:8080**.

## 5. Use the app

Open your browser to:

```
http://localhost:8080
```

This redirects to the login page. Click "Register here" to create an account, then log in.
After logging in you'll land on the dashboard where you can add, view, edit, and delete
students.

## Project structure

```
student-management-system/
├── pom.xml
└── src/main/
    ├── java/com/example/studentms/
    │   ├── StudentManagementSystemApplication.java
    │   ├── config/
    │   │   ├── SecurityConfig.java       (BCrypt bean + open filter chain)
    │   │   ├── AuthInterceptor.java      (guards /api/students/**)
    │   │   └── WebConfig.java            (registers the interceptor)
    │   ├── controller/
    │   │   ├── AuthController.java       (register/login/logout/me)
    │   │   └── StudentController.java    (student CRUD endpoints)
    │   ├── service/
    │   │   ├── UserService.java
    │   │   └── StudentService.java
    │   ├── repository/
    │   │   ├── UserRepository.java
    │   │   └── StudentRepository.java
    │   ├── model/
    │   │   ├── User.java
    │   │   └── Student.java
    │   ├── dto/
    │   │   ├── RegisterRequest.java
    │   │   ├── LoginRequest.java
    │   │   ├── AuthResponse.java
    │   │   └── MessageResponse.java
    │   └── exception/
    │       └── GlobalExceptionHandler.java
    └── resources/
        ├── application.properties
        └── static/
            ├── index.html
            ├── login.html
            ├── register.html
            ├── dashboard.html
            ├── css/style.css
            └── js/
                ├── login.js
                ├── register.js
                └── dashboard.js
```
