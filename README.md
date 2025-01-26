# CVWO Holiday Assignment

A simple web forum built using Go and React through TypeScript, taking some inspiration from the Reddit platform.

## Local deployment
This forum consists of frontend and backend components, both of which will need to be deployed separately from each other.

You will need to make sure that Node and Go are installed on your system before commencing local deployment.
1. Clone this GitHub repository:
    ```bash
   git clone https://github.com/Peanuts359/cvwo-holiday-assignment-definitive.git
   cd cvwo-holiday-assignment-definitive/
    ```
2. Create the necessary `.env` files:
    1. An `.env` file in the `frontend` directory as follows:
       `REACT_APP_BACKEND_URL=http://localhost:8080`
   2. An `.env` file in the `backend` directory as follows:
      ```
      ALLOWED_ORIGIN=http://localhost:3000
      JWT_SECRET=<secret key here>
      ```
3. Start up the components:
   ```bash
   cd backend/
   go run main.go
   cd ../frontend/
   npm start
   ```

You can access the frontend at http://localhost:3000 and the backend at http://localhost:8080.

## Features:
- User authentication through username and password
- Thread tags
- Upvote system
