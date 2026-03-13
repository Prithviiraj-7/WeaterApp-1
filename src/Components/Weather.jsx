import { useState } from "react";

const CONDITION_ICON = (condition = "") => {
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("cloud") || c.includes("overcast")) return "⛅";
  if (c.includes("fog") || c.includes("mist")) return "🌫️";
  return "☀️";
};

const STAT_ITEMS = [
  { key: "feelslike", label: "Feels Like", icon: "🌡️", fmt: (v, u, fn) => `${fn(v).toFixed(1)}°${u}` },
  { key: "humidity", label: "Humidity", icon: "💧", fmt: (v) => `${v}%` },
  { key: "windspeed", label: "Wind", icon: "💨", fmt: (v) => `${v} km/h` },
  { key: "uvindex", label: "UV Index", icon: "☀️", fmt: (v) => v ?? "—" },
  { key: "cloudcover", label: "Cloud Cover", icon: "☁️", fmt: (v) => `${v}%` },
  { key: "visibility", label: "Visibility", icon: "👁️", fmt: (v) => `${v} km` },
];

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("C");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedCity, setSearchedCity] = useState("");

  const convertTemp = (temp) => {
    if (temp == null) return 0;
    return unit === "C" ? temp : (temp * 9) / 5 + 32;
  };

  const fetchWeather = async (overrideCity) => {
    const target = (overrideCity ?? city).trim();
    if (!target) return;
    try {
      setError("");
      setLoading(true);
      const res = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${target}?unitGroup=metric&key=CQYBKZV6NCD6X8GUL2X35SC8G&contentType=json`
      );
      if (!res.ok) throw new Error("Invalid city");
      const data = await res.json();
      if (!data.currentConditions) throw new Error("Invalid city");

      const cc = data.currentConditions;
      setWeather({
        temp: cc.temp,
        feelslike: cc.feelslike,
        condition: cc.conditions,
        humidity: cc.humidity,
        windspeed: cc.windspeed,
        uvindex: cc.uvindex,
        cloudcover: cc.cloudcover,
        visibility: cc.visibility,
      });

      setHistory(prev =>
        prev.includes(target) ? prev : [target, ...prev.slice(0, 4)]
      );
      setSearchedCity(target);
      setCity("");
    } catch {
      setError("City not found. Please enter a valid city.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") fetchWeather(); };

  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  return (
    <div className="weather-section">

      {/* Search */}
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search city…"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => fetchWeather()} disabled={loading}>
          {loading ? "Loading…" : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && <p>{error}</p>}

      {/* Loader */}
      {loading && (
        <div className="loading-container">
          <div className="loader" />
          <p className="loading-text">Fetching weather…</p>
        </div>
      )}

      {/* Card */}
      {weather && !loading && (
        <div className="weather-card glass">

          {/* Top row */}
          <div className="card-day-row">
            <span className="card-day-label">Current Weather</span>
            <span className="card-date-badge">{dateStr}</span>
          </div>

          {/* City */}
          <p className="weather-city">{searchedCity}</p>

          {/* Temp + icon */}
          <div className="weather-main-row">
            <span className="weather-icon">{CONDITION_ICON(weather.condition)}</span>
            <div className="weather-temp-block">
              <span className="weather-temp">
                {convertTemp(weather.temp).toFixed(1)}
              </span>
              <span className="weather-temp-unit">°{unit}</span>
              <span className="weather-temp-hi">Live</span>
            </div>
          </div>

          {/* Condition */}
          <p className="weather-condition">{weather.condition}</p>

          {/* Stats */}
          <div className="weather-stats">
            {STAT_ITEMS.map(({ key, label, icon, fmt }) => (
              <div className="stat-row" key={key}>
                <span className="stat-label">
                  <span className="stat-icon">{icon}</span> {label}
                </span>
                <span className="stat-value">
                  {fmt(weather[key], unit, convertTemp)}
                </span>
              </div>
            ))}
          </div>

          {/* Toggle */}
          <button
            className="unit-toggle"
            onClick={() => setUnit(u => u === "C" ? "F" : "C")}
          >
            Switch to °{unit === "C" ? "F" : "C"}
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="history">
          <h4>Recent Searches</h4>
          <div className="history-items-row">
            {history.map((item, i) => (
              <span
                key={i}
                className="history-item"
                onClick={() => fetchWeather(item)}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Weather;