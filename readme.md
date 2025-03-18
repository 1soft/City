# Project Overview

This project is a comprehensive **To-Do Application** featuring user authentication and real-time updates. It comprises a Deno-based server with MongoDB integration and WebSocket support, an Angular 19 frontend utilizing Material Design, and an Nx workspace for monorepo management. Docker Compose is employed to streamline development and deployment through containerization.

## Purpose

The primary objective of this project is to provide a robust To-Do application that allows users to:

- **Register and Log In**: Users can create accounts and securely log in to manage their tasks.

- **Manage Tasks**: Authenticated users can add, edit, delete, and toggle the completion status of their to-do items.

- **Real-Time Updates**: Utilizing WebSockets, the application ensures that any changes to tasks are instantly reflected across all connected clients, providing a seamless collaborative experience.

- **Secure Communication**: Both API endpoints and WebSocket connections are protected using JSON Web Tokens (JWT) to ensure that only authenticated users can access and modify data.

## Components

1. **Deno Server**: Serves as the backend, handling API requests, managing data storage with MongoDB, and facilitating real-time communication via WebSockets.

2. **Angular 19 Frontend**: Provides the user interface, designed with Angular Material components to ensure a responsive and intuitive user experience.

3. **Nx Workspace**: Manages the monorepo structure on the client side, promoting code reusability and modularity through libraries and shared components.

4. **Docker Compose**: Orchestrates the entire stack, enabling seamless containerized development and deployment environments.

## Prerequisites

- **Docker**: Ensure Docker is installed to leverage containerization.

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/1soft/city.git
cd your-repo

### 2. Build and Start Services with Docker Compose

**Utilize Docker Compose to build and run the services:**
docker-compose up --build

**To stop and remove containers, networks, and images:**
docker-compose down --rmi all

### 3. Access the Application
Frontend: Visit http://localhost:4200 in your web browser.
Backend API: Access the API endpoints at http://localhost:8000/api.

### 4. Interact with MongoDB
**To access the MongoDB shell:**
docker exec -it mongo-container mongosh -u root -p rootpassword --authenticationDatabase admin

**Within the MongoDB shell, you can switch to the admin database and list users:**

use admin;
db.getUsers();

## Nx Workspace Commands
The Nx workspace facilitates efficient development through various commands:

**Generate a Library: Create reusable code modules.**

npx nx g @nx/angular:library --directory=libs/utils

**Generate a Component: Add new components to the project.**

npx nx g @nx/angular:component --style=scss --standalone=true

**Generate a Service: Create services for business logic.**

npx nx g service services/tasks --project=todo

**Path Configuration: Specify paths for components or services.**

path=libs/ui/src/lib/confirm/confirm

**Generate a Component with OnPush Change Detection: Optimize component performance.**

npx nx g @nx/angular:component apps/todo/src/components/pages/tasks/tasks --changeDetection=OnPush

**Port Management**

To identify processes using a specific port (e.g., port 8000):

lsof -i :8000

**Terminate a process occupying a port:**

kill -9 <PID>
Replace <PID> with the actual Process ID obtained from the previous command.

## Additional Resources
Deno and JWT Authentication: For insights on implementing JWT authentication in Deno, refer to this guide.

Authenticating Over WebSockets with JWT: For guidance on securing WebSocket connections using JWTs, consult this resource.

Angular & Deno JWT Authentication Video Series: To learn more about integrating Angular with Deno using JWT authentication, watch this video series.