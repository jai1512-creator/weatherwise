export function Navbar() {
  return (
    <header className="navbar" role="banner">
      <a className="navbar__brand" href="#top" aria-label="WeatherWise home">
        <span className="navbar__brand-dot" aria-hidden="true" />
        <span className="navbar__brand-text">WEATHERWISE</span>
      </a>
      <nav className="navbar__nav" aria-label="Primary navigation">
        <a href="#hero" className="navbar__link">
          Overview
        </a>
        <a href="#globe" className="navbar__link">
          Globe
        </a>
        <a href="#forecast" className="navbar__link">
          Forecast
        </a>
        <a href="#should-i-go" className="navbar__link navbar__link--cta">
          Should I Go?
        </a>
      </nav>
    </header>
  );
}
