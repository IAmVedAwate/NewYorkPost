# NewYorkPost
This project uses Node.js and React. Follow the instructions below to set up the project on your local machine.

## Prerequisites

- Node.js
- npm
- MongoDB

## Setup

1. Clone the repository to your local machine.
2. Navigate to the project directory.

    ```bash
    cd /path/to/project
    ```

3. Install the Node.js dependencies.

    ```bash
    npm install
    ```

4. Navigate to the `view` directory and install the dependencies.

    ```bash
    cd view
    npm install
    ```

5. Navigate back to the project root directory.

    ```bash
    cd ..
    ```

6. Start the Node.js server.

    ```bash
    npm run dev
    ```

7. Open a new terminal, navigate to the `view` directory, and start the React server.

    ```bash
    cd view
    npm run dev
    ```

This will start two servers: one for Node.js and another for React.

## Environment Variables

For the application to function correctly, you must specify the following environment variables in your `.env` file:

- `MONGO_URL`: The connection string for your MongoDB database.
- `TOKEN`: The secret key for JWT.

# Thanks For Visiting My Repository
