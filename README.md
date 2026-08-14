# TickerBrief AI

TickerBrief AI is an LLM Stock Market Insight App. The goal of the project is to let a user enter a stock ticker and receive a simple educational market brief.

This project is for educational purposes only and does not provide financial advice.

## Project Structure

```text
tickerbrief/
├── frontend/
│   ├── package.json
│   ├── src/
│   └── README.md
│
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/
│   └── data/
│
└── README.md

## Required Software

Before running this project locally, install:

- Node.js 20.19 or newer
- npm
- Python 3.12 or newer
- pip

No paid account is required to run the basic local version of this app.

If an LLM API is added later, an API key would be required. That key should be stored in a backend `.env` file and should not be placed in frontend code.

## Frontend Installation and Run Instructions

Open a terminal and move into the frontend folder:

```powershell
cd C:\Users\caden\tickerbrief\frontend
```

Install the frontend dependencies:

```powershell
npm install
```

Run the frontend locally:

```powershell
npm run dev
```

The frontend should run at:

```
http://localhost:5173
```

## Backend Installation and Run Instructions

Open a second terminal and move into the backend folder:

```powershell
cd C:\Users\caden\tickerbrief\backend
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
venv\Scripts\activate
```

After activation, the terminal should show `(venv)` at the beginning of the line.

Install the backend dependencies:

```powershell
pip install -r requirements.txt
```

Run the backend server:

```powershell
uvicorn app.main:app --reload
```

The backend should run at:

```text
http://127.0.0.1:8000
```

To test the backend, open this URL in a browser:

```text
http://127.0.0.1:8000
```

A sample ticker route can also be tested here:

```text
http://127.0.0.1:8000/brief/NVDA
```

## Environment Variables

The backend includes a `.env.example` file.

Example:

```text
LLM_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./data/tickerbrief.db
```

A real `.env` file should only be created locally if API keys are needed. Do not submit real API keys.

## Security Measures

This project includes the following basic security measures:

- API keys should be stored in backend environment variables.
- Real `.env` files should not be submitted.
- The frontend does not expose private API keys.
- The backend includes basic ticker input validation.
- The app clearly states that it is educational only and does not provide financial advice.

## Home Page Requirement

The home page includes:

- Project title/topic: TickerBrief AI — LLM Stock Market Insight App
- Footer copyright statement: © 2026 Caden Smith. All rights reserved.

## Running the Full App Locally

Use two terminals.

Terminal 1 — frontend:

```powershell
cd C:\Users\caden\tickerbrief\frontend
npm install
npm run dev
```

Terminal 2 — backend:

```powershell
cd C:\Users\caden\tickerbrief\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The About/Credits page describes the project technologies and links to the main packages and methods used, including React, Vite, FastAPI, Uvicorn, python-dotenv, and CSS.
