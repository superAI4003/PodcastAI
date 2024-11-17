## Prerequisites

- Node.js and npm installed on your machine.
- Python and pip installed on your machine.
- Ensure you have the necessary credentials for Google Cloud Platform (GCP).

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install the necessary npm packages:**

   ```bash
   npm install
   ```

3. **Create and configure the `.env` file:**

   Create a file named `.env` in the `frontend` directory and add the following configuration:

   ```plaintext
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8080
   ```

4. **Run the frontend development server:**

   ```bash
   npm run dev
   ```

   This will start the frontend server, typically accessible at `http://localhost:3000`.
