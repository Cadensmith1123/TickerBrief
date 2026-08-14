import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiDollarSign,
  FiExternalLink,
  FiGlobe,
  FiHome,
  FiInfo,
  FiSearch,
  FiShield,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import "./App.css";


const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


const technologies = [
  {
    name: "React",
    url: "https://react.dev/",
    purpose:
      "Builds the interactive frontend, search interface, and reusable application views.",
  },
  {
    name: "Vite",
    url: "https://vite.dev/",
    purpose:
      "Provides the frontend development server and production build system.",
  },
  {
    name: "FastAPI",
    url: "https://fastapi.tiangolo.com/",
    purpose:
      "Provides the Python backend API used by the React frontend.",
  },
  {
    name: "Uvicorn",
    url: "https://www.uvicorn.org/",
    purpose:
      "Runs the FastAPI backend application during local development.",
  },
  {
    name: "yfinance",
    url: "https://pypi.org/project/yfinance/",
    purpose:
      "Retrieves public market data, company information, historical prices, search results, and market movers from Yahoo Finance.",
  },
  {
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/",
    purpose:
      "Provides the underlying public financial information accessed through yfinance.",
  },
  {
    name: "python-dotenv",
    url: "https://pypi.org/project/python-dotenv/",
    purpose:
      "Supports backend environment-variable configuration without placing settings directly in frontend code.",
  },
  {
    name: "React Icons",
    url: "https://react-icons.github.io/react-icons/",
    purpose:
      "Provides the Feather icons used throughout the user interface.",
  },
  {
    name: "Google Fonts",
    url: "https://fonts.google.com/",
    purpose:
      "Provides the Inter font used throughout the application.",
  },
];


function formatMoney(value, currency = "USD") {
  if (value === null || value === undefined) {
    return "N/A";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${Number(value).toFixed(2)}`;
  }
}


function formatLargeNumber(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "N/A";
  }

  if (Math.abs(number) >= 1_000_000_000_000) {
    return `$${(number / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (Math.abs(number) >= 1_000_000_000) {
    return `$${(number / 1_000_000_000).toFixed(2)}B`;
  }

  if (Math.abs(number) >= 1_000_000) {
    return `$${(number / 1_000_000).toFixed(2)}M`;
  }

  return `$${number.toLocaleString("en-US")}`;
}


function formatPercent(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "N/A";
  }

  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
}


function formatPlainNumber(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "N/A";
  }

  return number.toFixed(2);
}


function MarketChart({ chart }) {
  if (!chart || chart.length < 2) {
    return (
      <div className="chart-empty">
        Historical price data is currently unavailable.
      </div>
    );
  }

  const width = 760;
  const height = 280;
  const padding = 18;

  const prices = chart
    .map((point) => Number(point.close))
    .filter((price) => Number.isFinite(price));

  if (prices.length < 2) {
    return (
      <div className="chart-empty">
        Historical price data is currently unavailable.
      </div>
    );
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = chart
    .map((point, index) => {
      const price = Number(point.close);

      if (!Number.isFinite(price)) {
        return null;
      }

      const x =
        padding +
        (index / (chart.length - 1)) *
          (width - padding * 2);

      const y =
        height -
        padding -
        ((price - min) / range) *
          (height - padding * 2);

      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(" ");

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  const direction =
    lastPrice >= firstPrice ? "gainer" : "loser";

  const fillPoints =
    `${padding},${height} ` +
    points +
    ` ${width - padding},${height}`;

  const firstDate = chart[0]?.date || "";
  const lastDate = chart[chart.length - 1]?.date || "";

  return (
    <div className="real-chart-wrapper">
      <svg
        className={`market-chart ${direction}`}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Historical stock price chart"
      >
        <line
          x1="0"
          y1="70"
          x2={width}
          y2="70"
          className="chart-grid"
        />

        <line
          x1="0"
          y1="140"
          x2={width}
          y2="140"
          className="chart-grid"
        />

        <line
          x1="0"
          y1="210"
          x2={width}
          y2="210"
          className="chart-grid"
        />

        <polygon
          points={fillPoints}
          className="chart-area"
        />

        <polyline
          points={points}
          className="chart-line"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="chart-date-row">
        <span>{firstDate}</span>
        <span>{lastDate}</span>
      </div>
    </div>
  );
}


function AboutToolSection() {
  return (
    <section className="purpose-section">
      <div className="section-heading">
        <div>
          <span className="section-label">
            ABOUT THE TOOL
          </span>

          <h2>
            Research a company without the clutter.
          </h2>

          <p>
            TickerBrief combines public financial data with
            a simple interface designed to help users quickly
            understand a company's recent market performance.
          </p>
        </div>
      </div>

      <div className="purpose-grid">
        <article>
          <FiSearch aria-hidden="true" />

          <h3>Find companies</h3>

          <p>
            Search publicly traded companies by ticker or
            company name using results retrieved through the
            backend financial-data service.
          </p>
        </article>

        <article>
          <FiBarChart2 aria-hidden="true" />

          <h3>Review real data</h3>

          <p>
            View recent prices, historical charts, market
            capitalization, revenue, margins, earnings, and
            other company information.
          </p>
        </article>

        <article>
          <FiShield aria-hidden="true" />

          <h3>Learn responsibly</h3>

          <p>
            TickerBrief AI is an educational project and does
            not provide investment recommendations or
            financial advice.
          </p>
        </article>
      </div>
    </section>
  );
}


function HomePage({ openCompany }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] =
    useState(false);
  const [searchLoading, setSearchLoading] =
    useState(false);
  const [searchError, setSearchError] =
    useState("");

  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [moversLoading, setMoversLoading] =
    useState(true);
  const [moversError, setMoversError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    async function loadMovers() {
      setMoversLoading(true);
      setMoversError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/movers`
        );

        if (!response.ok) {
          throw new Error(
            "Market movers could not be loaded."
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setGainers(data.gainers || []);
          setLosers(data.losers || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);

          setMoversError(
            "Current market movers are temporarily unavailable."
          );
        }
      } finally {
        if (!cancelled) {
          setMoversLoading(false);
        }
      }
    }

    loadMovers();

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    const query = searchTerm.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError("");
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/search?q=${encodeURIComponent(
            query
          )}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Company search could not be completed."
          );
        }

        const data = await response.json();

        setSearchResults(data.results || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);

          setSearchResults([]);

          setSearchError(
            "Company search is temporarily unavailable."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchTerm]);


  const featuredMover =
    gainers.length > 0
      ? gainers[0]
      : losers.length > 0
      ? losers[0]
      : null;


  function selectCompany(company) {
    setSearchTerm(
      `${company.name} (${company.symbol})`
    );

    setSearchFocused(false);
    setSearchResults([]);
    setSearchError("");

    openCompany(company.symbol);
  }


  function submitSearch(event) {
    event.preventDefault();

    if (searchResults.length > 0) {
      selectCompany(searchResults[0]);
      return;
    }

    const possibleTicker = searchTerm
      .trim()
      .toUpperCase();

    if (
      /^[A-Z0-9][A-Z0-9.\-]{0,14}$/.test(
        possibleTicker
      )
    ) {
      openCompany(possibleTicker);
      return;
    }

    setSearchError(
      "Select a company from the search suggestions."
    );
  }


  return (
    <main id="main-content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <FiActivity aria-hidden="true" />
            Real market data, simplified
          </span>

          <h1>Ticker Brief Generator</h1>

          <p className="hero-summary">
            Get quick insights into the fastest growing
            companies.
          </p>

          <div className="hero-tags">
            <span>
              <FiBarChart2 aria-hidden="true" />
              Real market data
            </span>

            <span>
              <FiBriefcase aria-hidden="true" />
              Company financials
            </span>

            <span>
              <FiShield aria-hidden="true" />
              Educational only
            </span>
          </div>
        </div>

        <div className="live-snapshot-card">
          <div className="snapshot-heading">
            <div>
              <span className="section-label">
                LIVE MARKET SNAPSHOT
              </span>

              <h2>
                {featuredMover
                  ? featuredMover.name
                  : "Market data"}
              </h2>

              <span className="ticker-text">
                {featuredMover
                  ? featuredMover.symbol
                  : "Yahoo Finance via yfinance"}
              </span>
            </div>

            <span className="live-badge">
              Live data
            </span>
          </div>

          {moversLoading && (
            <div className="snapshot-loading">
              Loading current market data...
            </div>
          )}

          {!moversLoading &&
            featuredMover && (
              <>
                <div className="snapshot-price">
                  <strong>
                    {formatMoney(
                      featuredMover.price
                    )}
                  </strong>

                  <span
                    className={
                      featuredMover.change_percent >= 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {featuredMover.change_percent >=
                    0 ? (
                      <FiTrendingUp
                        aria-hidden="true"
                      />
                    ) : (
                      <FiTrendingDown
                        aria-hidden="true"
                      />
                    )}

                    {formatPercent(
                      featuredMover.change_percent
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  className="snapshot-button"
                  onClick={() =>
                    openCompany(
                      featuredMover.symbol
                    )
                  }
                >
                  View company brief
                  <FiArrowRight
                    aria-hidden="true"
                  />
                </button>
              </>
            )}

          {!moversLoading &&
            !featuredMover && (
              <p className="snapshot-error">
                {moversError ||
                  "Market information is currently unavailable."}
              </p>
            )}

          <p className="snapshot-source">
            Data source: Yahoo Finance via yfinance
          </p>
        </div>
      </section>

      <AboutToolSection />

      <section className="search-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              COMPANY SEARCH
            </span>

            <h2>Generate a company brief</h2>

            <p>
              Search by company name or ticker symbol.
              Results are retrieved from the backend financial
              data source rather than a hard-coded company list.
            </p>
          </div>
        </div>

        <form
          className="company-search-form"
          onSubmit={submitSearch}
        >
          <label htmlFor="ticker-search">
            Search publicly traded companies
          </label>

          <div className="search-row">
            <div className="autocomplete">
              <div className="search-input">
                <FiSearch aria-hidden="true" />

                <input
                  id="ticker-search"
                  type="text"
                  placeholder="Try Apple, Microsoft, NVDA..."
                  value={searchTerm}
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={
                    searchFocused &&
                    (searchLoading ||
                      searchResults.length > 0)
                  }
                  aria-controls="company-suggestions"
                  onFocus={() =>
                    setSearchFocused(true)
                  }
                  onBlur={() => {
                    setTimeout(() => {
                      setSearchFocused(false);
                    }, 150);
                  }}
                  onChange={(event) => {
                    setSearchTerm(
                      event.target.value
                    );

                    setSearchFocused(true);
                    setSearchError("");
                  }}
                />
              </div>

              {searchFocused &&
                searchTerm.trim() && (
                  <div
                    id="company-suggestions"
                    className="search-dropdown"
                    role="listbox"
                  >
                    {searchLoading && (
                      <div className="search-status">
                        Searching companies...
                      </div>
                    )}

                    {!searchLoading &&
                      searchResults.map(
                        (company) => (
                          <button
                            type="button"
                            role="option"
                            className="search-suggestion"
                            key={`${company.symbol}-${company.exchange}`}
                            onMouseDown={(
                              event
                            ) => {
                              event.preventDefault();

                              selectCompany(
                                company
                              );
                            }}
                          >
                            <span className="suggestion-symbol">
                              {company.symbol
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>

                            <span className="suggestion-company">
                              <strong>
                                {company.name}
                              </strong>

                              <small>
                                {company.symbol}
                                {company.exchange
                                  ? ` · ${company.exchange}`
                                  : ""}
                              </small>
                            </span>

                            <FiArrowRight
                              className="suggestion-arrow"
                              aria-hidden="true"
                            />
                          </button>
                        )
                      )}

                    {!searchLoading &&
                      searchResults.length ===
                        0 &&
                      !searchError && (
                        <div className="search-status">
                          No matching companies
                          found.
                        </div>
                      )}
                  </div>
                )}
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Generate Brief
              <FiArrowRight aria-hidden="true" />
            </button>
          </div>

          <span className="search-help">
            Search results are retrieved from Yahoo
            Finance through the FastAPI backend.
          </span>

          {searchError && (
            <p
              className="search-error"
              role="alert"
            >
              {searchError}
            </p>
          )}
        </form>
      </section>

      <section className="movers-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              DAILY OVERVIEW
            </span>

            <h2>Today's Market Movers</h2>

            <p>
              Current gainers and losers retrieved through
              the project's financial-data integration.
              Select any company to open its detailed brief.
            </p>
          </div>

          <span className="live-data-label">
            Live market data
          </span>
        </div>

        {moversLoading && (
          <div className="loading-panel">
            Loading current market movers...
          </div>
        )}

        {moversError &&
          !moversLoading && (
            <div className="error-panel">
              {moversError}
            </div>
          )}

        {!moversLoading &&
          !moversError && (
            <div className="mover-columns">
              <div className="mover-group">
                <div className="mover-heading gain">
                  <span className="mover-icon">
                    <FiTrendingUp
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <span>Top 5</span>
                    <h3>Gainers</h3>
                  </div>
                </div>

                <div className="mover-list">
                  {gainers.map(
                    (company, index) => (
                      <button
                        type="button"
                        className="mover-row"
                        key={company.symbol}
                        onClick={() =>
                          openCompany(
                            company.symbol
                          )
                        }
                      >
                        <span className="mover-rank">
                          {index + 1}
                        </span>

                        <span className="mover-company">
                          <strong>
                            {company.symbol}
                          </strong>

                          <small>
                            {company.name}
                          </small>
                        </span>

                        <span className="mover-price">
                          {formatMoney(
                            company.price
                          )}
                        </span>

                        <span className="mover-change positive">
                          {formatPercent(
                            company.change_percent
                          )}
                        </span>

                        <FiArrowRight
                          className="row-arrow"
                          aria-hidden="true"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mover-group">
                <div className="mover-heading loss">
                  <span className="mover-icon">
                    <FiTrendingDown
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <span>Top 5</span>
                    <h3>Losers</h3>
                  </div>
                </div>

                <div className="mover-list">
                  {losers.map(
                    (company, index) => (
                      <button
                        type="button"
                        className="mover-row"
                        key={company.symbol}
                        onClick={() =>
                          openCompany(
                            company.symbol
                          )
                        }
                      >
                        <span className="mover-rank">
                          {index + 1}
                        </span>

                        <span className="mover-company">
                          <strong>
                            {company.symbol}
                          </strong>

                          <small>
                            {company.name}
                          </small>
                        </span>

                        <span className="mover-price">
                          {formatMoney(
                            company.price
                          )}
                        </span>

                        <span className="mover-change negative">
                          {formatPercent(
                            company.change_percent
                          )}
                        </span>

                        <FiArrowRight
                          className="row-arrow"
                          aria-hidden="true"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

        <p className="market-note">
          Financial information is retrieved from Yahoo
          Finance through the open-source yfinance package.
          Market data may be delayed and is provided for
          educational use only.
        </p>
      </section>
    </main>
  );
}


function CompanyPage({
  company,
  loading,
  error,
  goHome,
}) {
  if (loading) {
    return (
      <main
        id="main-content"
        className="company-page"
      >
        <div className="company-container">
          <button
            type="button"
            className="back-button"
            onClick={goHome}
          >
            <FiArrowLeft aria-hidden="true" />
            Back to Homepage
          </button>

          <div className="company-loading">
            <FiActivity aria-hidden="true" />

            <h1>Loading company brief...</h1>

            <p>
              Retrieving current market and financial
              information.
            </p>
          </div>
        </div>
      </main>
    );
  }


  if (error || !company) {
    return (
      <main
        id="main-content"
        className="company-page"
      >
        <div className="company-container">
          <button
            type="button"
            className="back-button"
            onClick={goHome}
          >
            <FiArrowLeft aria-hidden="true" />
            Back to Homepage
          </button>

          <div className="company-error">
            <FiInfo aria-hidden="true" />

            <h1>Company data unavailable</h1>

            <p>
              {error ||
                "TickerBrief could not load this company."}
            </p>
          </div>
        </div>
      </main>
    );
  }


  const positive =
    company.day_change_percent === null ||
    company.day_change_percent === undefined
      ? true
      : company.day_change_percent >= 0;


  return (
    <main
      id="main-content"
      className="company-page"
    >
      <div className="company-container">
        <button
          type="button"
          className="back-button"
          onClick={goHome}
        >
          <FiArrowLeft aria-hidden="true" />
          Back to Homepage
        </button>

        <div className="company-hero">
          <div>
            <span className="section-label">
              COMPANY MARKET BRIEF
            </span>

            <div className="company-title-row">
              <div className="company-logo">
                {company.symbol
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h1>{company.name}</h1>

                <p>
                  {company.symbol} ·{" "}
                  {company.exchange}
                </p>
              </div>
            </div>
          </div>

          <div className="company-quote">
            <span>Recent market price</span>

            <strong>
              {formatMoney(
                company.price,
                company.currency
              )}
            </strong>

            <span
              className={
                positive
                  ? "quote-change positive"
                  : "quote-change negative"
              }
            >
              {positive ? (
                <FiTrendingUp
                  aria-hidden="true"
                />
              ) : (
                <FiTrendingDown
                  aria-hidden="true"
                />
              )}

              {formatPercent(
                company.day_change_percent
              )}
            </span>
          </div>
        </div>

        <div className="performance-grid">
          <article>
            <span>1 Month</span>
            <strong
              className={
                company.month_return_percent >=
                0
                  ? "positive"
                  : "negative"
              }
            >
              {formatPercent(
                company.month_return_percent
              )}
            </strong>
          </article>

          <article>
            <span>3 Months</span>
            <strong
              className={
                company.three_month_return_percent >=
                0
                  ? "positive"
                  : "negative"
              }
            >
              {formatPercent(
                company.three_month_return_percent
              )}
            </strong>
          </article>

          <article>
            <span>1 Year</span>
            <strong
              className={
                company.year_return_percent >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {formatPercent(
                company.year_return_percent
              )}
            </strong>
          </article>
        </div>

        <div className="detail-grid">
          <section className="detail-chart-card">
            <div className="card-heading">
              <div>
                <span className="section-label">
                  REAL PRICE HISTORY
                </span>

                <h2>1-Year Price Trend</h2>
              </div>

              <span className="live-data-label">
                Yahoo Finance
              </span>
            </div>

            <MarketChart
              chart={company.chart}
            />
          </section>

          <aside className="company-summary-card">
            <span className="section-label">
              COMPANY OVERVIEW
            </span>

            <h2>About {company.name}</h2>

            <p>{company.description}</p>

            <div className="overview-items">
              <div>
                <span>Sector</span>
                <strong>
                  {company.sector}
                </strong>
              </div>

              <div>
                <span>Industry</span>
                <strong>
                  {company.industry}
                </strong>
              </div>

              <div>
                <span>Market Cap</span>
                <strong>
                  {formatLargeNumber(
                    company.market_cap
                  )}
                </strong>
              </div>

              <div>
                <span>52-Week Range</span>
                <strong>
                  {formatMoney(
                    company.fifty_two_week_low,
                    company.currency
                  )}{" "}
                  –{" "}
                  {formatMoney(
                    company.fifty_two_week_high,
                    company.currency
                  )}
                </strong>
              </div>
            </div>

            {company.website && (
              <a
                className="company-website"
                href={company.website}
                target="_blank"
                rel="noreferrer"
              >
                <FiGlobe aria-hidden="true" />
                Company website
                <FiExternalLink
                  aria-hidden="true"
                />
              </a>
            )}
          </aside>
        </div>

        <section className="financial-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                FINANCIAL DATA
              </span>

              <h2>Financial Snapshot</h2>

              <p>
                Current company fundamentals retrieved through
                the project's Yahoo Finance data integration.
              </p>
            </div>
          </div>

          <div className="financial-grid">
            <article>
              <FiDollarSign
                aria-hidden="true"
              />

              <span>Revenue</span>

              <strong>
                {formatLargeNumber(
                  company.revenue
                )}
              </strong>

              <small>
                Reported total revenue
              </small>
            </article>

            <article>
              <FiTrendingUp
                aria-hidden="true"
              />

              <span>Revenue Growth</span>

              <strong>
                {formatPercent(
                  company.revenue_growth_percent
                )}
              </strong>

              <small>
                Reported revenue growth
              </small>
            </article>

            <article>
              <FiActivity
                aria-hidden="true"
              />

              <span>Operating Margin</span>

              <strong>
                {formatPercent(
                  company.operating_margin_percent
                )}
              </strong>

              <small>
                Reported operating margin
              </small>
            </article>

            <article>
              <FiBarChart2
                aria-hidden="true"
              />

              <span>Trailing EPS</span>

              <strong>
                {formatPlainNumber(
                  company.trailing_eps
                )}
              </strong>

              <small>
                Earnings per share
              </small>
            </article>
          </div>

          <div className="secondary-financial-grid">
            <article>
              <span>Profit Margin</span>

              <strong>
                {formatPercent(
                  company.profit_margin_percent
                )}
              </strong>
            </article>

            <article>
              <span>Trailing P/E</span>

              <strong>
                {formatPlainNumber(
                  company.trailing_pe
                )}
              </strong>
            </article>

            <article>
              <span>Forward P/E</span>

              <strong>
                {formatPlainNumber(
                  company.forward_pe
                )}
              </strong>
            </article>

            <article>
              <span>Forward EPS</span>

              <strong>
                {formatPlainNumber(
                  company.forward_eps
                )}
              </strong>
            </article>
          </div>
        </section>

        <section className="data-source-card">
          <div className="insight-icon">
            <FiInfo aria-hidden="true" />
          </div>

          <div>
            <span className="section-label">
              DATA SOURCE
            </span>

            <h2>
              Real financial information
            </h2>

            <p>
              This company page retrieves its price
              history and financial information from
              Yahoo Finance through the yfinance Python
              package. Values may be delayed or unavailable
              for some securities.
            </p>

            <div className="education-warning">
              <FiShield aria-hidden="true" />

              Educational information only. This is not
              financial advice or an investment
              recommendation.
            </div>
          </div>
        </section>

        <section className="ai-status-card">
          <div className="insight-icon muted-icon">
            <FiActivity aria-hidden="true" />
          </div>

          <div>
            <span className="section-label">
              AI SUMMARY STATUS
            </span>

            <h2>
              AI-generated summaries are not enabled yet
            </h2>

            <p>
              The current version uses real financial data,
              but an external LLM has not yet been connected.
              This section is intentionally labeled so the
              application does not claim that rule-based or
              static text is AI-generated.
            </p>
          </div>
        </section>

        <button
          type="button"
          className="bottom-back-button"
          onClick={goHome}
        >
          <FiArrowLeft aria-hidden="true" />
          Return to Homepage
        </button>
      </div>
    </main>
  );
}


function AboutPage() {
  return (
    <main
      id="main-content"
      className="about-page"
    >
      <section className="about-intro">
        <span className="eyebrow">
          <FiInfo aria-hidden="true" />
          About the project
        </span>

        <h1>Technology and Credits</h1>

        <p>
          TickerBrief AI is a class project combining a
          React frontend with a FastAPI backend and public
          market information. The application currently
          retrieves real financial information through
          yfinance and Yahoo Finance.
        </p>
      </section>

      <section className="credits-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              TECHNOLOGIES
            </span>

            <h2>
              Packages and methods used
            </h2>

            <p>
              Third-party technologies and data sources
              used by the project are credited and linked
              below.
            </p>
          </div>
        </div>

        <div className="technology-grid">
          {technologies.map(
            (technology) => (
              <article
                className="technology-card"
                key={technology.name}
              >
                <div>
                  <h3>
                    {technology.name}
                  </h3>

                  <p>
                    {technology.purpose}
                  </p>
                </div>

                <a
                  href={technology.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit site
                  <FiExternalLink
                    aria-hidden="true"
                  />
                </a>
              </article>
            )
          )}
        </div>
      </section>

      <section className="credits-note">
        <h2>
          Design and development credits
        </h2>

        <p>
          OpenAI ChatGPT provided assistance with the
          dashboard layout,  accessibility styling, formatting 
          , and frontend component organization.
          The  implementation, project decisions,
           by Caden Smith.
        </p>

        <p>
          The CSS source file also contains an explicit
          comment citing ChatGPT's design assistance, as
          requested for the course project help.</p>

        <p>
          Financial information is retrieved from Yahoo
          Finance through the open-source yfinance Python
          package. Market information may be delayed and
          should be used for educational purposes only.
        </p>

        <p>
          An external LLM is not currently enabled as I didn't have the funds for it, so the
          present version does not claim that its company
          descriptions or summaries are AI-generated.
        </p>
      </section>
    </main>
  );
}


function App() {
  const [page, setPage] = useState("home");

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [companyLoading, setCompanyLoading] =
    useState(false);

  const [companyError, setCompanyError] =
    useState("");


  async function openCompany(symbol) {
    setPage("company");
    setSelectedCompany(null);
    setCompanyLoading(true);
    setCompanyError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/brief/${encodeURIComponent(
          symbol
        )}`
      );

      if (!response.ok) {
        let message =
          "Unable to retrieve company information.";

        try {
          const errorData =
            await response.json();

          if (errorData.detail) {
            message = errorData.detail;
          }
        } catch {
          // Keep default message.
        }

        throw new Error(message);
      }

      const data = await response.json();

      setSelectedCompany(data);
    } catch (error) {
      console.error(error);

      setCompanyError(
        error.message ||
          "Unable to retrieve company information."
      );
    } finally {
      setCompanyLoading(false);
    }
  }


  function goHome() {
    setPage("home");
    setSelectedCompany(null);
    setCompanyError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function showAbout() {
    setPage("about");
    setSelectedCompany(null);
    setCompanyError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main-content"
      >
        Skip to main content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <button
            type="button"
            className="brand"
            onClick={goHome}
            aria-label="Return to TickerBrief AI homepage"
          >
            <span className="brand-icon">
              <FiBarChart2
                aria-hidden="true"
              />
            </span>

            <span className="brand-copy">
              <strong>
                TickerBrief AI
              </strong>

              <small>
                Market insight, simplified
              </small>
            </span>
          </button>

          <nav aria-label="Main navigation">
            <button
              type="button"
              className={
                page === "home"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={goHome}
            >
              <FiHome aria-hidden="true" />
              Home
            </button>

            <button
              type="button"
              className={
                page === "about"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={showAbout}
            >
              <FiInfo aria-hidden="true" />
              About 
            </button>
          </nav>
        </div>
      </header>

      {page === "home" && (
        <HomePage
          openCompany={openCompany}
        />
      )}

      {page === "company" && (
        <CompanyPage
          company={selectedCompany}
          loading={companyLoading}
          error={companyError}
          goHome={goHome}
        />
      )}

      {page === "about" && (
        <AboutPage />
      )}

      <footer>
        <div className="footer-inner">
          <div>
            <strong>
              TickerBrief AI
            </strong>

            <span>
              LLM Stock Market Insight App
            </span>
          </div>

          <p>
            © 2026 Caden Smith. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


export default App;