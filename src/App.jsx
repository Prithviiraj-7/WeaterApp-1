import { useState } from "react";
import Weather from "./Components/Weather";
import "./App.css";

function App() {
  const quotes = [
    "Discipline beats motivation.",
    "Consistency builds greatness.",
    "Win the day.",
    "Pressure creates diamonds."
  ];

  const [quote, setQuote] = useState(quotes[0]);

  const fetchQuote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quotes.length);
    } while (quotes[randomIndex] === quote);
    setQuote(quotes[randomIndex]);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  }).toUpperCase();

  return (
    <>
      {/* Quote bar */}
      <div className="top-quote glass">
        <p>{quote}</p>
        <button onClick={fetchQuote}>↻</button>
      </div>

      {/* Header */}
      <header className="site-header">
        <h1 className="logo">
          <span className="logo-icon">🌤</span>
          OutDoor<span className="logo-text">360</span>
        </h1>
      </header>

      {/* Main content */}
      <div className="main-wrapper">
        <div className="main-content">
          <div className="date-section">
            <span className="date-label">{today}</span>
            <span className="date-arrow">›</span>
          </div>
          <Weather />
        </div>
      </div>
    </>
  );
}

export default App;