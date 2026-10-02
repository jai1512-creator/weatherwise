export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__content">
        <p className="footer__brand">
          <strong>WeatherWise</strong> · Cinematic atmospheric forecast engine
        </p>
        <p className="footer__attribution">
          Weather data by{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Open-Meteo
          </a>
          . Geocoding via Open-Meteo, OpenStreetMap Nominatim, &amp; BigDataCloud.
        </p>
      </div>
    </footer>
  );
}
