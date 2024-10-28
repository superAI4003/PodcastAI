# Project Setup and Execution

This guide will help you set up and run the project, which consists of a frontend and a backend service.

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

3. **Run the frontend development server:**

   ```bash
   npm run dev
   ```

   This will start the frontend server, typically accessible at `http://localhost:3000`.

## Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install the required Python packages:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Check GCP Credentials Path:**

   Ensure that the path to your GCP credentials in `main.py` is correct. The current path is set as:

   ```python
   os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'D:\\Current Project\\@Podcast-AI\\backend\\gcp.json'
   ```

   Update this path if your credentials are located elsewhere.

4. **Run the backend server:**

   ```bash
   uvicorn main:app --reload --port=8080
   ```

   This will start the backend server, accessible at `http://localhost:8080`.

## Additional Notes

- Ensure that your GCP credentials have the necessary permissions for the operations you intend to perform.