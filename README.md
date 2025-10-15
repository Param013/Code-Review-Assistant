🤖 Code Review Assistant
The Code Review Assistant is a full-stack application designed to automate and streamline the initial phase of code review using a Large Language Model (LLM). Developers can upload code files or paste snippets and receive an immediate, structured analysis covering potential bugs, performance issues, style problems, and security concerns.

✨ Features
Automated Review Generation: Uses the OpenAI API to generate comprehensive code reviews based on a specialized prompt template.

Structured Feedback: Reviews are structured with sections like Strengths, Readability, Security, and Concrete Suggested Fixes.

Review History: Stores past review reports, file details, and timestamps using a SQLite database for easy reference.

Cross-Origin Support: Configured with CORS for seamless integration between the Python Flask backend and a modern JavaScript frontend.

🛠️ Technology Stack
Component

Technology

Description

Backend

Python, Flask

REST API for handling file uploads, managing the database, and calling the LLM.

LLM

OpenAI API (gpt-4o-mini, gpt-3.5-turbo)

Core logic for generating code analysis reports.

Database

SQLite, SQLAlchemy

Lightweight persistence layer for storing review history.

Frontend

React, Vite, Tailwind CSS (Implied)

(To be built/run) Modern build environment and UI framework.

⚙️ Setup and Installation
1. Project Structure
Ensure your project is structured with separate backend and frontend directories:

Code-Review-Assistant/
├── backend/
│   ├── app.py
│   ├── models.py
│   └── .venv/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── postcss.config.js (or postcss.config.cjs)
│   └── ...
└── .env

2. Backend Setup (Python)
Navigate to the backend directory.

Create Virtual Environment & Activate:

python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

Install Python Dependencies:
You must install the necessary packages, including the modern openai SDK, which your app.py is now configured for.

pip install flask flask-cors sqlalchemy python-dotenv openai

Create .env File:
In the root directory of your project (Code-Review-Assistant/), create a file named .env and add your configuration details.

# .env (in the root of the project)
OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"
DATABASE_URL="sqlite:///db.sqlite3"
PORT=5000 

3. Frontend Setup (Node)
Navigate to the frontend directory.

Install Node Dependencies:

npm install
# OR
yarn install

Critical: Fix PostCSS Configuration
Based on previous errors, your postcss.config.js file needs to use the correct module syntax for a modern Vite project. Ensure your postcss.config.js uses the robust object notation:

// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
