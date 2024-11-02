# Project

This project is an application that can be run using Docker. The application consists of a backend available at `localhost:3000` and a frontend available at `localhost:80`.
Additionally, it includes an admin panel accessible only to registered users at `localhost:80/admin`.

## Prerequisites

1. Copy the contents of the `.env.example` file to a `.env` file in the `backend/src/` folder.
2. Run the following command to build and start the application in Docker:
   ```bash
   docker-compose up --build
   ```
