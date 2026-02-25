import { useState } from "react";
import Weather from "./Weather";
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

  return (
    <>
      <>
 <div className="top-quote glass">
    <p>{quote}</p>
    <button onClick={fetchQuote}>↻</button>
  </div>

  <div className="main-wrapper">
    <div className="main-content">
      <h1 className="logo">OutDoor360 ☁</h1>
      <Weather />
    </div>
  </div>
</>
    </>
  );
}

export default App;