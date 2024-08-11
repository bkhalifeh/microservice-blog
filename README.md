# microservice-blog

## Description

This project is a simple blog platform developed using the NestJS framework. It leverages microservice and event-driven architecture to ensure scalability, flexibility, and efficient communication between different components. The architecture is designed to handle various aspects of a blog, such as post creation, comment management, and user interaction, through distinct microservices that communicate via events. This setup allows for seamless integration, improved performance, and ease of maintenance.

Key features include:
- **Microservice Architecture**: Each core functionality (e.g., posts, comments) is handled by a dedicated microservice, promoting modularity and scalability.
- **Event-Driven Communication**: The microservices communicate through events, ensuring loose coupling and asynchronous processing.
- **NestJS Framework**: Utilizes NestJS for building scalable and maintainable server-side applications with TypeScript.

## Authentication

- HTTP Authentication, scheme: bearer


## User Service

### User signs up.

POST /api/v1/user/sign-up

```json
{
    "fullName": "behzad khalifeh",
    "email": "bkhalifeh@protonmail.com",
    "password": "Behzad@Kh80"
}
```

### User signs in.

POST /api/v1/user/sign-in

```json
{
    "email": "bkhalifeh@protonmail.com",
    "password": "Behzad@Kh80"
}
```

### Get information about the user.

GET /api/v1/user


## Post Service

### Create a new post.

POST /api/v1/post

```json
{
    "title": "microservice",
    "content": "Hello World!"
}
```

### Get a list of all posts.

GET /api/v1/post

### Get a list of all posts authored by a specific user.

GET /api/v1/user/:userId/post

### Get all information about the post.

GET /api/v1/post/:postId

## Comment Service

### Get a list of comments on the post.

GET /api/v1/post/:postId/comment

### Add a new comment to the post.

POST /api/v1/post/10/comment

```json
{
    "content": "Woow"
}
```

