import { useEffect, useState } from "react";
import loadingIcon from "../assets/loading-svgrepo-com.svg";
import "./styles.css";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

export default function WeatherApp() {
  const APIKEY = "ff6cb0521d0048ae88d170430242304";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [data, setData] = useState(null);
  const [city, setCity] = useState("Atyrau");
  const [input, setInput] = useState("");

  const [currentDate, setCurrentDate] = useState(getDate());

  function handleSubmit() {
    setTimeout(() => {
      if (input) {
        setCity(input);
        setInput("");
      }
    }, 1000);
  }

  async function fetchData() {
    try {
      setLoading(true);
      const responseForCity = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${city}&aqi=no`
      );
      const gettedDataForCity = await responseForCity.json();

      if (gettedDataForCity && gettedDataForCity.error === undefined) {
        setData(gettedDataForCity);
        setLoading(false);
      } else {
        setErrorMessage(gettedDataForCity.error.message);
        setLoading(false);
      }
    } catch (e) {
      setErrorMessage(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [city]);

  if (loading) {
    return (
      <div className="loading-page">
        <img src={loadingIcon} alt="loading-icon" />
      </div>
    );
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="container">
      <div className="wrapper">
        <header>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="city"
          />
          <button onClick={handleSubmit}>Search</button>
        </header>
        {data ? (
          <main>
            <div className="date">{currentDate}</div>
            <div className="city-name">{data.location.name}</div>
            <div className="tem-and-icon">
              <div className="temp">{data.current.temp_c}°C</div>
              <img
                className="icon"
                src={data.current.condition.icon}
                alt="icon"
              />
            </div>
            <div className="short-describtion">
              {data.current.condition.text}
            </div>
            <ul className="features">
              <li className="humidity">Humidity: {data.current.humidity}%</li>
              <li className="wind">Wind: {data.current.wind_kph} km/h</li>
              <li className="feels_like">
                Feels Like: {data.current.feelslike_c}°C
              </li>
            </ul>
          </main>
        ) : (
          <main>
            <div className="date">25/4/24</div>
            <div className="city-name">Atyrau</div>
            <div className="tem-and-icon">
              <div className="temp">25.5°C</div>
              <div className="icon">Icon</div>
            </div>
            <div className="short-describtion">Partly Cloudy</div>
            <ul className="features">
              <li className="humidity">Humidity: 32%</li>
              <li className="wind">Wind: 12.1 km/h</li>
              <li className="feels_like">Feels Like: 25.2°C</li>
            </ul>
          </main>
        )}
      </div>
    </div>
  );
}
