from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI(title="TickerBrief AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "TickerBrief AI backend is running."
    }


@app.get("/brief/{ticker}")
def get_brief(ticker: str):
    ticker = ticker.upper()

    if not re.fullmatch(r"[A-Z]{1,6}", ticker):
        return {
            "error": "Invalid ticker symbol."
        }

    return {
        "ticker": ticker,
        "summary": "This is a placeholder educational market brief. This app does not provide financial advice."
    }