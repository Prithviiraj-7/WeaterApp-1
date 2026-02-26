import { useState } from "react";

const CONDITION_ICON = (condition = "") => {
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "⛈";
  if (c.includes("rain") || c.includes("drizzle")) return "🌧";
  if (c.includes("snow")) return "❄️";
  if (c.includes("cloud") || c.includes("overcast")) return "⛅";
  if (c.includes("fog") || c.includes("mist")) return "🌫";
  return "☀️";
};

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

  const fetchWeather = async () => {
    if (!city.trim()) return;
    try {
      setError("");
      setLoading(true);
      const res = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=CQYBKZV6NCD6X8GUL2X35SC8G&contentType=json`
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

      if (!history.includes(city.trim())) {
        setHistory(prev => [city.trim(), ...prev.slice(0, 4)]);
      }
      setSearchedCity(city.trim());
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
    month: "numeric", day: "numeric"
  });

  return (
    <div className="weather-section">

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? "Loading…" : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && <p>{error}</p>}

      {/* Loader */}
      {loading && (
        <div className="loading-container">
          <p className="loading-text">Fetching weather…</p>
          <div className="loader" />
        </div>
      )}

      {/* Card */}
      {weather && !loading && (
        <div className="weather-card glass">

          {/* Day row */}
          <div className="card-day-row">
            <span className="card-day-label">Day</span>
            <span className="card-date-badge">{dateStr}</span>
          </div>

          {/* City name — with spacing below before temp */}
          <p className="weather-city">{searchedCity}</p>

          {/* Temp + icon */}
          <div className="weather-main-row">
            <span className="weather-icon">{CONDITION_ICON(weather.condition)}</span>
            <div className="weather-temp-block">
              <span className="weather-temp">
                {convertTemp(weather.temp).toFixed(1)}
              </span>
              <span className="weather-temp-unit">°{unit}</span>
              <span className="weather-temp-hi">Hi</span>
            </div>
          </div>

          {/* Condition description */}
          <p className="weather-condition">{weather.condition}</p>

          {/* Stats grid */}
          <div className="weather-stats">
            <div className="stat-row">
              <span className="stat-label">Feels Like</span>
              <span className="stat-value">{convertTemp(weather.feelslike).toFixed(1)}°{unit}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Humidity</span>
              <span className="stat-value">{weather.humidity}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Wind Speed</span>
              <span className="stat-value">{weather.windspeed} km/h</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">UV Index</span>
              <span className="stat-value">{weather.uvindex ?? "—"}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Cloud Cover</span>
              <span className="stat-value">{weather.cloudcover}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Visibility</span>
              <span className="stat-value">{weather.visibility} km</span>
            </div>
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
                onClick={() => { setCity(item); }}
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