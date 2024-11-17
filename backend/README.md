## Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install the required Python packages:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Create and configure the `.env` file:**

   Create a file named `.env` in the `backend` directory and add the following configuration:

   ```plaintext
   GOOGLE_APPLICATION_CREDENTIALS=D:\Current Project\@Podcast-AI\backend\gcp.json
   ```

   Update this path if your credentials are located elsewhere.
 

4. **Run the backend server:**

   ```bash
   uvicorn main:app --reload --port=8080
   ```

   This will start the backend server, accessible at `http://localhost:8080`.


## How to use Batch Generation

### Options

- `-article`: Specify the article to be discussed.
- `-user_prompt`: Specify the user prompt by name as saved in the database.
- `-system_prompt`: Specify the system prompt by name as saved in the database.
- `-speaker_1`: Specify the first speaker.
- `-speaker_2`: Specify the second speaker.
- `-help`: Display help information with available prompts and speakers.


2. Run the `run_batch_generation.py` file with the following command:

   ```bash
   python run_batch_generation.py -article "Generative AI"  -user_prompt "UserPrompt1" -system_prompt "SysPrompt 1" -speaker_1 "en-US-Neural2-A" -speaker_2 "en-US-Journey-O"
   ```
3. You can see help information with the following command:

   ```bash
   python run_batch_generation.py -help
   ```
