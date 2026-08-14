import { useMemo, useState } from "react";
import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiDollarSign,
  FiExternalLink,
  FiHome,
  FiInfo,
  FiSearch,
  FiShield,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import "./App.css";

const companies = [
  {
    ticker: "WDAY",
    name: "Workday",
    direction: "gainer",
    change: 17.4,
    price: "$241.80",
    sector: "Enterprise Software",
    description:
      "Workday develops cloud-based software for finance, human resources, planning, and enterprise management.",
    revenue: "$9.4B",
    revenueGrowth: "+15.2%",
    operatingMargin: "24.6%",
    eps: "$7.18",
    marketCap: "$65B",
    range: "$199 – $294",
    chart: [38, 42, 40, 45, 43, 48, 52, 51, 58, 60, 68, 78],
  },
  {
    ticker: "SNDK",
    name: "Sandisk",
    direction: "gainer",
    change: 13.9,
    price: "$318.40",
    sector: "Data Storage",
    description:
      "Sandisk develops flash-memory and storage technologies used across consumer electronics, computing, and data-center applications.",
    revenue: "$8.7B",
    revenueGrowth: "+21.4%",
    operatingMargin: "19.8%",
    eps: "$5.42",
    marketCap: "$44B",
    range: "$172 – $326",
    chart: [30, 34, 38, 36, 42, 46, 51, 55, 62, 67, 73, 82],
  },
  {
    ticker: "NFLX",
    name: "Netflix",
    direction: "gainer",
    change: 5.3,
    price: "$1,286.50",
    sector: "Entertainment",
    description:
      "Netflix is a global streaming entertainment company offering subscription-based television, film, and interactive content.",
    revenue: "$48.2B",
    revenueGrowth: "+13.1%",
    operatingMargin: "29.4%",
    eps: "$25.84",
    marketCap: "$540B",
    range: "$875 – $1,310",
    chart: [43, 46, 44, 48, 53, 51, 57, 62, 60, 66, 72, 76],
  },
  {
    ticker: "MU",
    name: "Micron Technology",
    direction: "gainer",
    change: 4.1,
    price: "$248.70",
    sector: "Semiconductors",
    description:
      "Micron Technology produces memory and storage products, including DRAM and NAND technologies used in AI systems, computers, and data centers.",
    revenue: "$39.6B",
    revenueGrowth: "+28.7%",
    operatingMargin: "31.8%",
    eps: "$12.46",
    marketCap: "$278B",
    range: "$142 – $267",
    chart: [36, 41, 45, 43, 49, 55, 53, 60, 64, 69, 74, 79],
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    direction: "gainer",
    change: 2.7,
    price: "$782.20",
    sector: "Communication Services",
    description:
      "Meta Platforms operates Facebook, Instagram, WhatsApp, Threads, and a growing portfolio of artificial-intelligence and virtual-reality technologies.",
    revenue: "$186.5B",
    revenueGrowth: "+16.3%",
    operatingMargin: "42.1%",
    eps: "$28.64",
    marketCap: "$1.97T",
    range: "$532 – $804",
    chart: [48, 47, 51, 54, 52, 58, 61, 65, 63, 68, 71, 75],
  },

  {
    ticker: "TPR",
    name: "Tapestry",
    direction: "loser",
    change: -16.2,
    price: "$91.40",
    sector: "Luxury Retail",
    description:
      "Tapestry is the parent company of Coach and Kate Spade and operates a portfolio of global fashion and luxury-accessory brands.",
    revenue: "$7.3B",
    revenueGrowth: "+4.8%",
    operatingMargin: "18.7%",
    eps: "$5.64",
    marketCap: "$19B",
    range: "$57 – $118",
    chart: [78, 76, 79, 74, 72, 75, 69, 67, 63, 61, 57, 47],
  },
  {
    ticker: "CSCO",
    name: "Cisco Systems",
    direction: "loser",
    change: -8.3,
    price: "$71.60",
    sector: "Networking",
    description:
      "Cisco develops networking, cybersecurity, collaboration, and infrastructure technologies used by businesses and governments around the world.",
    revenue: "$59.8B",
    revenueGrowth: "+7.6%",
    operatingMargin: "27.5%",
    eps: "$3.42",
    marketCap: "$282B",
    range: "$54 – $79",
    chart: [75, 74, 76, 72, 70, 69, 71, 66, 64, 61, 59, 52],
  },
  {
    ticker: "HTZ",
    name: "Hertz",
    direction: "loser",
    change: -8.8,
    price: "$7.82",
    sector: "Transportation",
    description:
      "Hertz operates vehicle-rental brands serving airport, leisure, and business customers across numerous global markets.",
    revenue: "$9.1B",
    revenueGrowth: "-2.8%",
    operatingMargin: "7.1%",
    eps: "-$0.48",
    marketCap: "$2.5B",
    range: "$4 – $12",
    chart: [76, 72, 73, 68, 66, 62, 65, 59, 56, 53, 49, 45],
  },
  {
    ticker: "JD",
    name: "JD.com",
    direction: "loser",
    change: -7.2,
    price: "$31.40",
    sector: "E-Commerce",
    description:
      "JD.com is a major technology and e-commerce company operating online retail, logistics, cloud, and marketplace businesses.",
    revenue: "$165B",
    revenueGrowth: "+9.2%",
    operatingMargin: "4.6%",
    eps: "$3.18",
    marketCap: "$48B",
    range: "$29 – $51",
    chart: [73, 76, 70, 68, 69, 64, 61, 59, 55, 57, 51, 46],
  },
  {
    ticker: "COHR",
    name: "Coherent",
    direction: "loser",
    change: -7.9,
    price: "$126.80",
    sector: "Photonics",
    description:
      "Coherent develops lasers, optical networking components, semiconductor materials, and photonics technologies used in communications and industrial systems.",
    revenue: "$6.2B",
    revenueGrowth: "+12.8%",
    operatingMargin: "15.2%",
    eps: "$4.87",
    marketCap: "$21B",
    range: "$79 – $142",
    chart: [79, 77, 73, 75, 70, 68, 65, 61, 63, 58, 53, 48],
  },
];

const technologies = [
  {
    name: "React",
    url: "https://react.dev/",
    purpose: "Builds the interactive frontend and reusable application views.",
  },
  {
    name: "Vite",
    url: "https://vite.dev/",
    purpose: "Provides the frontend development server and build system.",
  },
  {
    name: "FastAPI",
    url: "https://fastapi.tiangolo.com/",
    purpose: "Provides the Python backend API.",
  },
  {
    name: "Uvicorn",
    url: "https://www.uvicorn.org/",
    purpose: "Runs the FastAPI application locally.",
  },
  {
    name: "python-dotenv",
    url: "https://pypi.org/project/python-dotenv/",
    purpose: "Keeps backend environment variables outside frontend code.",
  },
  {
    name: "React Icons",
    url: "https://react-icons.github.io/react-icons/",
    purpose: "Provides the Feather icons used throughout the interface.",
  },
  {
    name: "Google Fonts",
    url: "https://fonts.google.com/",
    purpose: "Provides the Inter font used throughout the interface.",
  },
];

function MarketChart({ values, direction = "gainer" }) {
  const width = 700;
  const height = 250;
  const padding = 15;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x =
        padding + (index / (values.length - 1)) * (width - padding * 2);

      const y =
        height -
        padding -
        ((value - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `${padding},${height} ${points} ${
    width - padding
  },${height}`;

  return (
    <svg
      className={`market-chart ${direction}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Illustrative sample price chart using dummy data"
    >
      <line x1="0" y1="62" x2="700" y2="62" className="chart-grid" />
      <line x1="0" y1="125" x2="700" y2="125" className="chart-grid" />
      <line x1="0" y1="188" x2="700" y2="188" className="chart-grid" />

      <polygon points={fillPoints} className="chart-area" />

      <polyline
        points={points}
        className="chart-line"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function HomePage({ openCompany }) {
  const [ticker, setTicker] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const gainers = companies.filter(
    (company) => company.direction === "gainer"
  );

  const losers = companies.filter(
    (company) => company.direction === "loser"
  );

  const filteredCompanies = useMemo(() => {
    const query = ticker.trim().toUpperCase();

    const matches = companies.filter((company) => {
      if (!query) {
        return true;
      }

      return (
        company.ticker.toUpperCase().includes(query) ||
        company.name.toUpperCase().includes(query)
      );
    });

    return matches.sort((a, b) => {
      if (!query) {
        return a.name.localeCompare(b.name);
      }

      const aTicker = a.ticker.toUpperCase();
      const bTicker = b.ticker.toUpperCase();
      const aName = a.name.toUpperCase();
      const bName = b.name.toUpperCase();

      const aExactTicker = aTicker === query;
      const bExactTicker = bTicker === query;

      if (aExactTicker && !bExactTicker) return -1;
      if (bExactTicker && !aExactTicker) return 1;

      const aTickerStarts = aTicker.startsWith(query);
      const bTickerStarts = bTicker.startsWith(query);

      if (aTickerStarts && !bTickerStarts) return -1;
      if (bTickerStarts && !aTickerStarts) return 1;

      const aNameStarts = aName.startsWith(query);
      const bNameStarts = bName.startsWith(query);

      if (aNameStarts && !bNameStarts) return -1;
      if (bNameStarts && !aNameStarts) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [ticker]);

  function chooseCompany(company) {
    setTicker(company.ticker);
    setSearchError("");
    setSearchFocused(false);
    setActiveSuggestion(-1);
    openCompany(company);
  }

  function searchTicker(event) {
    event.preventDefault();

    const cleaned = ticker.trim().toUpperCase();

    const exactMatch = companies.find(
      (company) =>
        company.ticker.toUpperCase() === cleaned ||
        company.name.toUpperCase() === cleaned
    );

    if (exactMatch) {
      chooseCompany(exactMatch);
      return;
    }

    if (filteredCompanies.length === 1) {
      chooseCompany(filteredCompanies[0]);
      return;
    }

    if (!cleaned) {
      setSearchError("Start typing a company name or ticker.");
      setSearchFocused(true);
      return;
    }

    setSearchError(
      "Choose a company from the dropdown suggestions."
    );
    setSearchFocused(true);
  }

  function handleSearchKeyDown(event) {
    if (!searchFocused || filteredCompanies.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveSuggestion((current) =>
        current < filteredCompanies.length - 1
          ? current + 1
          : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveSuggestion((current) =>
        current > 0
          ? current - 1
          : filteredCompanies.length - 1
      );
    }

    if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();

      chooseCompany(filteredCompanies[activeSuggestion]);
    }

    if (event.key === "Escape") {
      setSearchFocused(false);
      setActiveSuggestion(-1);
    }
  }

  return (
    <main id="main-content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <FiActivity aria-hidden="true" />
            Market insights
          </span>

          <h1>Ticker Brief Generator</h1>

          <p className="hero-summary">
            Get quick insights into the fastest growing companies.
          </p>

          <form className="hero-search" onSubmit={searchTicker}>
            <label htmlFor="ticker-search">
              Search for a company
            </label>

            <div className="search-row">
              <div className="autocomplete">
                <div className="search-input">
                  <FiSearch aria-hidden="true" />

                  <input
                    id="ticker-search"
                    type="text"
                    placeholder="Search ticker or company..."
                    value={ticker}
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={
                      searchFocused &&
                      filteredCompanies.length > 0
                    }
                    aria-controls="company-suggestions"
                    aria-activedescendant={
                      activeSuggestion >= 0
                        ? `company-suggestion-${activeSuggestion}`
                        : undefined
                    }
                    onFocus={() => {
                      setSearchFocused(true);
                      setActiveSuggestion(-1);
                    }}
                    onChange={(event) => {
                      setTicker(event.target.value);
                      setSearchError("");
                      setSearchFocused(true);
                      setActiveSuggestion(-1);
                    }}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>

                {searchFocused &&
                  filteredCompanies.length > 0 && (
                    <div
                      id="company-suggestions"
                      className="search-dropdown"
                      role="listbox"
                    >
                      {filteredCompanies.map(
                        (company, index) => (
                          <button
                            id={`company-suggestion-${index}`}
                            type="button"
                            role="option"
                            aria-selected={
                              activeSuggestion === index
                            }
                            className={
                              activeSuggestion === index
                                ? "search-suggestion active"
                                : "search-suggestion"
                            }
                            key={company.ticker}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              chooseCompany(company);
                            }}
                            onMouseEnter={() =>
                              setActiveSuggestion(index)
                            }
                          >
                            <span className="suggestion-symbol">
                              {company.ticker.slice(0, 2)}
                            </span>

                            <span className="suggestion-company">
                              <strong>{company.name}</strong>

                              <small>
                                {company.ticker} ·{" "}
                                {company.sector}
                              </small>
                            </span>

                            <span
                              className={
                                company.change >= 0
                                  ? "suggestion-change positive"
                                  : "suggestion-change negative"
                              }
                            >
                              {company.change >= 0 ? "+" : ""}
                              {company.change.toFixed(1)}%
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  )}

                {searchFocused &&
                  ticker.trim() &&
                  filteredCompanies.length === 0 && (
                    <div className="search-dropdown empty-dropdown">
                      No companies match "{ticker}".
                    </div>
                  )}
              </div>

              <button type="submit" className="primary-button">
                Generate Brief
                <FiArrowRight aria-hidden="true" />
              </button>
            </div>

            <span
              id="ticker-search-help"
              className="search-help"
            >
              Search by company name or ticker. Suggestions narrow
              automatically as you type.
            </span>

            {searchError && (
              <p className="search-error" role="alert">
                {searchError}
              </p>
            )}
          </form>

          <div className="hero-tags">
            <span>
              <FiBarChart2 aria-hidden="true" />
              Market data
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

        <div className="prototype-card">
          <div className="prototype-top">
            <div>
              <span className="section-label">
                SAMPLE BRIEF
              </span>

              <h2>NVIDIA</h2>

              <span className="ticker-text">
                NASDAQ: NVDA
              </span>
            </div>

            <span className="sample-badge">
              Sample data
            </span>
          </div>

          <div className="prototype-price">
            <strong>$226.80</strong>

            <span>
              <FiTrendingUp aria-hidden="true" />
              +0.7%
            </span>
          </div>

          <MarketChart
            values={[
              45, 48, 47, 53, 51, 58, 57, 63, 67, 66, 72,
              78,
            ]}
            direction="gainer"
          />

          <div className="prototype-stats">
            <div>
              <span>30 Day</span>
              <strong>+6.8%</strong>
            </div>

            <div>
              <span>Market Cap</span>
              <strong>$5.5T</strong>
            </div>

            <div>
              <span>Sentiment</span>
              <strong>Positive</strong>
            </div>
          </div>

          <p className="sample-disclaimer">
            Demonstration values only. This card does not
            display live market data.
          </p>
        </div>
      </section>

      <section className="movers-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              DAILY OVERVIEW
            </span>

            <h2>Today's Market Movers</h2>

            <p>
              Explore five notable gainers and losers. Select a
              company to view its expanded sample market brief.
            </p>
          </div>

          <span className="demo-label">Sample data</span>
        </div>

        <div className="mover-columns">
          <div className="mover-group">
            <div className="mover-heading gain">
              <span className="mover-icon">
                <FiTrendingUp aria-hidden="true" />
              </span>

              <div>
                <span>Top 5</span>
                <h3>Gainers</h3>
              </div>
            </div>

            <div className="mover-list">
              {gainers.map((company, index) => (
                <button
                  type="button"
                  className="mover-row"
                  key={company.ticker}
                  onClick={() => openCompany(company)}
                >
                  <span className="mover-rank">
                    {index + 1}
                  </span>

                  <span className="mover-company">
                    <strong>{company.ticker}</strong>
                    <small>{company.name}</small>
                  </span>

                  <span className="mover-price">
                    {company.price}
                  </span>

                  <span className="mover-change positive">
                    +{company.change.toFixed(1)}%
                  </span>

                  <FiArrowRight
                    className="row-arrow"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mover-group">
            <div className="mover-heading loss">
              <span className="mover-icon">
                <FiTrendingDown aria-hidden="true" />
              </span>

              <div>
                <span>Top 5</span>
                <h3>Losers</h3>
              </div>
            </div>

            <div className="mover-list">
              {losers.map((company, index) => (
                <button
                  type="button"
                  className="mover-row"
                  key={company.ticker}
                  onClick={() => openCompany(company)}
                >
                  <span className="mover-rank">
                    {index + 1}
                  </span>

                  <span className="mover-company">
                    <strong>{company.ticker}</strong>
                    <small>{company.name}</small>
                  </span>

                  <span className="mover-price">
                    {company.price}
                  </span>

                  <span className="mover-change negative">
                    {company.change.toFixed(1)}%
                  </span>

                  <FiArrowRight
                    className="row-arrow"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="market-note">
          Market-mover names were chosen to resemble current
          market direction, but all displayed prices,
          percentages, financial figures, and charts in this
          prototype should be treated as illustrative sample
          data.
        </p>
      </section>

      <section className="purpose-section">
        <span className="section-label">
          ABOUT THE TOOL
        </span>

        <h2>Research a company without the clutter.</h2>

        <div className="purpose-grid">
          <article>
            <FiSearch aria-hidden="true" />

            <h3>Find companies</h3>

            <p>
              Search by ticker or discover companies through
              the daily market-movers dashboard.
            </p>
          </article>

          <article>
            <FiBarChart2 aria-hidden="true" />

            <h3>Review performance</h3>

            <p>
              Company pages organize performance, financial
              metrics, charts, and background information.
            </p>
          </article>

          <article>
            <FiShield aria-hidden="true" />

            <h3>Learn responsibly</h3>

            <p>
              TickerBrief AI is an educational project and does
              not provide financial advice or price predictions.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

function CompanyPage({ company, goHome }) {
  const positive = company.direction === "gainer";

  return (
    <main id="main-content" className="company-page">
      <div className="company-container">
        <button
          type="button"
          className="back-button"
          onClick={goHome}
        >
          <FiArrowLeft aria-hidden="true" />
          Back to Market Movers
        </button>

        <div className="company-hero">
          <div>
            <span className="section-label">
              COMPANY MARKET BRIEF
            </span>

            <div className="company-title-row">
              <div className="company-logo">
                {company.ticker.slice(0, 2)}
              </div>

              <div>
                <h1>{company.name}</h1>

                <p>
                  {company.ticker} · {company.sector}
                </p>
              </div>
            </div>
          </div>

          <div className="company-quote">
            <span>Sample price</span>

            <strong>{company.price}</strong>

            <span
              className={
                positive
                  ? "quote-change positive"
                  : "quote-change negative"
              }
            >
              {positive ? (
                <FiTrendingUp aria-hidden="true" />
              ) : (
                <FiTrendingDown aria-hidden="true" />
              )}

              {positive ? "+" : ""}
              {company.change.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="detail-grid">
          <section className="detail-chart-card">
            <div className="card-heading">
              <div>
                <span className="section-label">
                  RECENT PERFORMANCE
                </span>

                <h2>Price Trend</h2>
              </div>

              <span className="sample-badge">
                Illustrative
              </span>
            </div>

            <MarketChart
              values={company.chart}
              direction={company.direction}
            />

            <div className="chart-timeframe">
              <span>1D</span>
              <span>1W</span>
              <span className="selected">1M</span>
              <span>3M</span>
              <span>1Y</span>
            </div>
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
                <strong>{company.sector}</strong>
              </div>

              <div>
                <span>Market Cap</span>
                <strong>{company.marketCap}</strong>
              </div>

              <div>
                <span>52-Week Range</span>
                <strong>{company.range}</strong>
              </div>
            </div>
          </aside>
        </div>

        <section className="financial-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                RECENT FINANCIALS
              </span>

              <h2>Financial Snapshot</h2>

              <p>
                Illustrative values used to demonstrate the
                intended TickerBrief company-page layout.
              </p>
            </div>
          </div>

          <div className="financial-grid">
            <article>
              <FiDollarSign aria-hidden="true" />

              <span>Revenue</span>
              <strong>{company.revenue}</strong>
              <small>Sample trailing revenue</small>
            </article>

            <article>
              <FiTrendingUp aria-hidden="true" />

              <span>Revenue Growth</span>
              <strong>{company.revenueGrowth}</strong>
              <small>Sample year-over-year</small>
            </article>

            <article>
              <FiActivity aria-hidden="true" />

              <span>Operating Margin</span>
              <strong>{company.operatingMargin}</strong>
              <small>Sample operating result</small>
            </article>

            <article>
              <FiBarChart2 aria-hidden="true" />

              <span>EPS</span>
              <strong>{company.eps}</strong>
              <small>Sample earnings per share</small>
            </article>
          </div>
        </section>

        <section className="insight-card">
          <div className="insight-icon">
            <FiActivity aria-hidden="true" />
          </div>

          <div>
            <span className="section-label">
              SAMPLE AI INSIGHT
            </span>

            <h2>What could be driving the move?</h2>

            <p>
              {positive
                ? `${company.name} is shown as a positive market mover in this prototype. A production version of TickerBrief AI would combine recent price data, company financials, earnings information, and market context before generating an educational explanation of the movement.`
                : `${company.name} is shown as a negative market mover in this prototype. A production version of TickerBrief AI would examine recent price activity, earnings results, company guidance, financial performance, and broader market context before explaining the decline.`}
            </p>

            <div className="education-warning">
              <FiShield aria-hidden="true" />
              Educational example only. This is not financial
              advice and is not an investment recommendation.
            </div>
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
    <main id="main-content" className="about-page">
      <section className="about-intro">
        <span className="eyebrow">
          <FiInfo aria-hidden="true" />
          About the project
        </span>

        <h1>Technology and Credits</h1>

        <p>
          TickerBrief AI is a class project designed to combine
          a modern React interface with a Python backend, market
          data, financial calculations, database concepts, and
          future LLM-generated educational market explanations.
        </p>
      </section>

      <section className="credits-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              TECHNOLOGIES
            </span>

            <h2>Packages and methods used</h2>

            <p>
              Third-party technologies used by the project are
              credited and linked below.
            </p>
          </div>
        </div>

        <div className="technology-grid">
          {technologies.map((technology) => (
            <article
              className="technology-card"
              key={technology.name}
            >
              <div>
                <h3>{technology.name}</h3>
                <p>{technology.purpose}</p>
              </div>

              <a
                href={technology.url}
                target="_blank"
                rel="noreferrer"
              >
                Visit site
                <FiExternalLink aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="credits-note">
        <h2>Design and artwork credits</h2>

        <p>
          Charts and visual illustrations used in this prototype
          are original SVG and CSS interface elements created
          specifically for TickerBrief AI and do not represent
          live financial information.
        </p>

        <p>
          The original interface concept and portions of frontend
          development assistance were created with OpenAI
          ChatGPT. Final implementation and project decisions
          were reviewed and incorporated by Caden Smith.
        </p>
      </section>
    </main>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [selectedCompany, setSelectedCompany] = useState(null);

  function goHome() {
    setSelectedCompany(null);
    setPage("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openCompany(company) {
    setSelectedCompany(company);
    setPage("company");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function showAbout() {
    setSelectedCompany(null);
    setPage("about");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
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
              <FiBarChart2 aria-hidden="true" />
            </span>

            <span className="brand-copy">
              <strong>TickerBrief AI</strong>
              <small>Market insight, simplified</small>
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
              Project About
            </button>
          </nav>
        </div>
      </header>

      {page === "home" && (
        <HomePage openCompany={openCompany} />
      )}

      {page === "company" && selectedCompany && (
        <CompanyPage
          company={selectedCompany}
          goHome={goHome}
        />
      )}

      {page === "about" && <AboutPage />}

      <footer>
        <div className="footer-inner">
          <div>
            <strong>TickerBrief AI</strong>
            <span>Stock Market Insight App</span>
          </div>

          <p>
            © 2026 Caden Smith
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;