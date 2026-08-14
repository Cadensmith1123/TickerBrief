import os
import re
from datetime import datetime, timezone

import yfinance as yf
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


# ---------------------------------------------------------
# Environment setup
# ---------------------------------------------------------

load_dotenv()


# ---------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------

app = FastAPI(
    title="TickerBrief AI API",
    description="Financial data API for the TickerBrief AI class project.",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

# Local React development server
LOCAL_FRONTEND = "http://localhost:5173"

# Current deployed Vercel frontend
DEFAULT_DEPLOYED_FRONTEND = "https://ticker-brief-puce.vercel.app"

DEPLOYED_FRONTEND = os.getenv(
    "FRONTEND_ORIGIN",
    DEFAULT_DEPLOYED_FRONTEND,
).rstrip("/")


allowed_origins = list(
    dict.fromkeys(
        [
            LOCAL_FRONTEND,
            DEPLOYED_FRONTEND,
        ]
    )
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Validation
# ---------------------------------------------------------

# Supports normal ticker symbols such as:
# AAPL
# MSFT
# BRK-B
# BF-B
#
# This intentionally prevents arbitrary text from being passed
# into ticker-specific endpoints.
TICKER_PATTERN = re.compile(
    r"^[A-Z0-9][A-Z0-9.\-]{0,14}$"
)


# ---------------------------------------------------------
# Helper functions
# ---------------------------------------------------------

def safe_float(value):
    """
    Convert a numeric value into a JSON-safe float.

    Returns None when the value cannot safely be converted.
    """

    if value is None:
        return None

    try:
        number = float(value)

        # NaN does not compare equal to itself.
        if number != number:
            return None

        return number

    except (TypeError, ValueError):
        return None


def rounded(value, digits=2):
    """
    Return a rounded JSON-safe number.
    """

    number = safe_float(value)

    if number is None:
        return None

    return round(number, digits)


def percent_from_decimal(value):
    """
    Yahoo company fundamentals often return percentages
    as decimals.

    Example:
        0.153 -> 15.3
    """

    number = safe_float(value)

    if number is None:
        return None

    return round(number * 100, 2)


def company_name_from_info(info, symbol):
    """
    Find the best available company name.
    """

    return (
        info.get("longName")
        or info.get("shortName")
        or symbol
    )


def format_search_result(item):
    """
    Convert a Yahoo Finance search result into the smaller
    structure needed by the React autocomplete menu.
    """

    symbol = item.get("symbol")

    if not symbol:
        return None

    name = (
        item.get("longname")
        or item.get("shortname")
        or item.get("longName")
        or item.get("shortName")
        or symbol
    )

    exchange = (
        item.get("exchDisp")
        or item.get("exchange")
        or ""
    )

    quote_type = item.get("quoteType") or ""

    return {
        "symbol": symbol,
        "name": name,
        "exchange": exchange,
        "quote_type": quote_type,
    }


def format_mover(item):
    """
    Convert a Yahoo Finance screener result into the format
    needed by the frontend gainers/losers cards.
    """

    symbol = item.get("symbol")

    if not symbol:
        return None

    name = (
        item.get("longName")
        or item.get("shortName")
        or item.get("displayName")
        or symbol
    )

    price = (
        item.get("regularMarketPrice")
        or item.get("intradayprice")
    )

    change_percent = (
        item.get("regularMarketChangePercent")
        or item.get("percentChange")
        or item.get("percentchange")
    )

    return {
        "symbol": symbol,
        "name": name,
        "price": rounded(price),
        "change_percent": rounded(change_percent),
    }


def calculate_percent_change(new_value, old_value):
    """
    Calculate percentage change between two prices.
    """

    new_number = safe_float(new_value)
    old_number = safe_float(old_value)

    if new_number is None:
        return None

    if old_number is None or old_number == 0:
        return None

    return round(
        ((new_number - old_number) / old_number) * 100,
        2,
    )


# ---------------------------------------------------------
# Root route
# ---------------------------------------------------------

@app.get("/")
def root():
    """
    Simple health-check route.
    """

    return {
        "message": "TickerBrief AI backend is running.",
        "data_source": "Yahoo Finance via yfinance",
        "ai_enabled": False,
    }


# ---------------------------------------------------------
# Company search
# ---------------------------------------------------------

@app.get("/search")
def search_companies(
    q: str = Query(
        ...,
        min_length=1,
        max_length=50,
        description="Company name or ticker symbol",
    )
):
    """
    Search Yahoo Finance using either a company name
    or ticker symbol.

    Examples:

        /search?q=Apple
        /search?q=AAPL
        /search?q=Microsoft
        /search?q=NVDA
    """

    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty.",
        )

    try:
        search = yf.Search(
            query,
            max_results=12,
            news_count=0,
            lists_count=0,
            include_cb=False,
            include_nav_links=False,
            include_research=False,
            enable_fuzzy_query=True,
            recommended=12,
            raise_errors=False,
        )

        results = []

        for item in search.quotes:
            quote_type = str(
                item.get("quoteType", "")
            ).upper()

            # TickerBrief is focused primarily on public companies.
            # ETFs are allowed as well because Yahoo search can return
            # them alongside normal equities.
            if quote_type not in {
                "EQUITY",
                "ETF",
            }:
                continue

            result = format_search_result(item)

            if result:
                results.append(result)

        query_upper = query.upper()

        # Sort results so the autocomplete feels natural:
        #
        # 1. Exact ticker
        # 2. Ticker starts with query
        # 3. Company name starts with query
        # 4. Everything else alphabetically
        results.sort(
            key=lambda company: (
                (
                    0
                    if company["symbol"].upper()
                    == query_upper
                    else 1
                    if company["symbol"].upper().startswith(
                        query_upper
                    )
                    else 2
                    if company["name"].upper().startswith(
                        query_upper
                    )
                    else 3
                ),
                company["name"].lower(),
            )
        )

        return {
            "query": query,
            "results": results[:8],
            "data_source": "Yahoo Finance via yfinance",
        }

    except Exception as error:
        print(
            f"TickerBrief search error for "
            f"'{query}': {error}"
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Company search is temporarily unavailable."
            ),
        )


# ---------------------------------------------------------
# Daily market movers
# ---------------------------------------------------------

@app.get("/movers")
def get_market_movers():
    """
    Retrieve current daily gainers and losers.

    These replace the hard-coded example companies currently
    stored in the frontend.
    """

    try:
        gainers_response = yf.screen(
            "day_gainers",
            count=5,
        )

        losers_response = yf.screen(
            "day_losers",
            count=5,
        )

        gainers = []
        losers = []

        for item in gainers_response.get(
            "quotes",
            [],
        ):
            mover = format_mover(item)

            if mover:
                gainers.append(mover)

        for item in losers_response.get(
            "quotes",
            [],
        ):
            mover = format_mover(item)

            if mover:
                losers.append(mover)

        # Ensure gainers are highest percentage first.
        gainers.sort(
            key=lambda company: (
                company["change_percent"]
                if company["change_percent"]
                is not None
                else -999999
            ),
            reverse=True,
        )

        # Ensure losers are most negative first.
        losers.sort(
            key=lambda company: (
                company["change_percent"]
                if company["change_percent"]
                is not None
                else 999999
            )
        )

        return {
            "gainers": gainers[:5],
            "losers": losers[:5],
            "data_source": "Yahoo Finance via yfinance",
            "retrieved_at": datetime.now(
                timezone.utc
            ).isoformat(),
        }

    except Exception as error:
        print(
            f"TickerBrief market movers error: {error}"
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Market movers are temporarily unavailable."
            ),
        )


# ---------------------------------------------------------
# Individual company brief
# ---------------------------------------------------------

@app.get("/brief/{ticker}")
def get_stock_brief(ticker: str):
    """
    Retrieve real financial and market information for
    one ticker.

    Examples:

        /brief/AAPL
        /brief/MSFT
        /brief/NVDA
        /brief/INTC
    """

    symbol = ticker.strip().upper()

    if not TICKER_PATTERN.fullmatch(symbol):
        raise HTTPException(
            status_code=400,
            detail="Invalid ticker symbol.",
        )

    try:
        stock = yf.Ticker(symbol)

        # -------------------------------------------------
        # Historical price data
        # -------------------------------------------------

        history = stock.history(
            period="1y",
            interval="1d",
            auto_adjust=False,
        )

        if (
            history.empty
            or "Close" not in history.columns
        ):
            raise HTTPException(
                status_code=404,
                detail=(
                    f"No market data was found for "
                    f"{symbol}."
                ),
            )

        closes = history["Close"].dropna()

        if closes.empty:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"No price history was found for "
                    f"{symbol}."
                ),
            )

        current_price = safe_float(
            closes.iloc[-1]
        )

        previous_close = (
            safe_float(closes.iloc[-2])
            if len(closes) >= 2
            else None
        )

        day_change_percent = (
            calculate_percent_change(
                current_price,
                previous_close,
            )
        )


        # -------------------------------------------------
        # 1-month return
        # -------------------------------------------------

        approximately_one_month = (
            closes.iloc[-22:]
            if len(closes) >= 22
            else closes
        )

        month_start_price = (
            safe_float(
                approximately_one_month.iloc[0]
            )
            if not approximately_one_month.empty
            else None
        )

        month_return_percent = (
            calculate_percent_change(
                current_price,
                month_start_price,
            )
        )


        # -------------------------------------------------
        # 3-month return
        # -------------------------------------------------

        approximately_three_months = (
            closes.iloc[-66:]
            if len(closes) >= 66
            else closes
        )

        three_month_start = (
            safe_float(
                approximately_three_months.iloc[0]
            )
            if not approximately_three_months.empty
            else None
        )

        three_month_return_percent = (
            calculate_percent_change(
                current_price,
                three_month_start,
            )
        )


        # -------------------------------------------------
        # 1-year return
        # -------------------------------------------------

        year_start_price = safe_float(
            closes.iloc[0]
        )

        year_return_percent = (
            calculate_percent_change(
                current_price,
                year_start_price,
            )
        )


        # -------------------------------------------------
        # Chart data
        # -------------------------------------------------

        chart = []

        for date, close in closes.items():
            close_value = rounded(close)

            if close_value is None:
                continue

            chart.append(
                {
                    "date": date.strftime(
                        "%Y-%m-%d"
                    ),
                    "close": close_value,
                }
            )


        # -------------------------------------------------
        # Company information
        # -------------------------------------------------

        try:
            info = stock.get_info()

            if not isinstance(info, dict):
                info = {}

        except Exception as info_error:
            print(
                f"Info lookup failed for "
                f"{symbol}: {info_error}"
            )

            info = {}


        company_name = (
            company_name_from_info(
                info,
                symbol,
            )
        )


        # -------------------------------------------------
        # Financial information
        # -------------------------------------------------

        market_cap = safe_float(
            info.get("marketCap")
        )

        total_revenue = safe_float(
            info.get("totalRevenue")
        )

        revenue_growth = (
            percent_from_decimal(
                info.get("revenueGrowth")
            )
        )

        operating_margin = (
            percent_from_decimal(
                info.get("operatingMargins")
            )
        )

        profit_margin = (
            percent_from_decimal(
                info.get("profitMargins")
            )
        )

        trailing_eps = rounded(
            info.get("trailingEps")
        )

        forward_eps = rounded(
            info.get("forwardEps")
        )

        trailing_pe = rounded(
            info.get("trailingPE")
        )

        forward_pe = rounded(
            info.get("forwardPE")
        )

        fifty_two_week_low = rounded(
            info.get("fiftyTwoWeekLow")
        )

        fifty_two_week_high = rounded(
            info.get("fiftyTwoWeekHigh")
        )


        # -------------------------------------------------
        # Determine general recent direction
        # -------------------------------------------------

        if (
            month_return_percent
            is not None
            and month_return_percent > 0
        ):
            recent_direction = "positive"

        elif (
            month_return_percent
            is not None
            and month_return_percent < 0
        ):
            recent_direction = "negative"

        else:
            recent_direction = "flat"


        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return {
            "symbol": symbol,

            "name": company_name,

            "exchange": (
                info.get("fullExchangeName")
                or info.get("exchange")
                or "Not available"
            ),

            "currency": (
                info.get("currency")
                or "USD"
            ),

            "sector": (
                info.get("sector")
                or "Not available"
            ),

            "industry": (
                info.get("industry")
                or "Not available"
            ),

            "description": (
                info.get(
                    "longBusinessSummary"
                )
                or (
                    "A detailed company "
                    "description is not "
                    "currently available."
                )
            ),

            "website": info.get("website"),

            "price": rounded(
                current_price
            ),

            "previous_close": rounded(
                previous_close
            ),

            "day_change_percent": (
                day_change_percent
            ),

            "month_return_percent": (
                month_return_percent
            ),

            "three_month_return_percent": (
                three_month_return_percent
            ),

            "year_return_percent": (
                year_return_percent
            ),

            "recent_direction": (
                recent_direction
            ),

            "market_cap": market_cap,

            "revenue": total_revenue,

            "revenue_growth_percent": (
                revenue_growth
            ),

            "operating_margin_percent": (
                operating_margin
            ),

            "profit_margin_percent": (
                profit_margin
            ),

            "trailing_eps": trailing_eps,

            "forward_eps": forward_eps,

            "trailing_pe": trailing_pe,

            "forward_pe": forward_pe,

            "fifty_two_week_low": (
                fifty_two_week_low
            ),

            "fifty_two_week_high": (
                fifty_two_week_high
            ),

            "chart": chart,

            "ai_enabled": False,

            "ai_summary": None,

            "data_source": (
                "Yahoo Finance via yfinance"
            ),

            "retrieved_at": datetime.now(
                timezone.utc
            ).isoformat(),

            "disclaimer": (
                "TickerBrief AI is for "
                "educational purposes only "
                "and does not provide "
                "financial advice."
            ),
        }


    except HTTPException:
        raise


    except Exception as error:
        print(
            f"TickerBrief error for "
            f"{symbol}: {error}"
        )

        raise HTTPException(
            status_code=503,
            detail=(
                f"Unable to retrieve financial "
                f"information for {symbol} "
                f"right now."
            ),
        )