import { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("C");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const convertTemp = (temp) => {
    if (temp == null) return 0;
    if (unit === "C") return temp;
    return (temp * 9 / 5) + 32;
  };

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setError("");
      setLoading(true);

      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=CQYBKZV6NCD6X8GUL2X35SC8G&contentType=json`
      );

      if (!response.ok) {
        throw new Error("Invalid city");
      }

      const data = await response.json();

      if (!data.currentConditions) {
        throw new Error("Invalid city");
      }

      setWeather({
        temp: data.currentConditions.temp,
        condition: data.currentConditions.conditions,
        humidity: data.currentConditions.humidity,
      });

      // slice to add history of upto 5 cities only
      if (!history.includes(city)) {
        setHistory([city, ...history.slice(0, 4)]);
      }

      setCity("");

    } catch (err) {
      setError("City not found. Please enter a valid city.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-section">

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={fetchWeather} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {loading && (
  <div className="loading-container">
    <p className="loading-text">Fetching weather...</p>
    <div className="loader"></div>
  </div>
)}

      {weather && !loading && (
        <div className="weather-card glass">
          <p>
            🌡 {convertTemp(weather.temp).toFixed(1)}°{unit}
          </p>
          <p>☁ {weather.condition}</p>
          <p>💧 {weather.humidity}%</p>

          <button
            style={{ marginTop: "12px" }}
            onClick={() => setUnit(unit === "C" ? "F" : "C")}
          >
            Switch to °{unit === "C" ? "F" : "C"}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h4>Recent Searches</h4>
          {history.map((item, index) => (
            <span key={index} className="history-item">
              {item}
            </span>
          ))}
        </div>
      )}

    </div>
  );
}

export default Weather;