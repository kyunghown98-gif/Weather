import React from 'react'
import { useSelector } from 'react-redux'
import '../css/currentweather.css'

const CurrentWeather = () => {
  const getWeatherEmoji = (main, id) => {
    switch (main) {
      case "Clear": return "☀️";
      case "Clouds": return id === 801 ? "🌤️" : "☁️";
      case "Rain": return "🌧️";
      case "Drizzle": return "🌦️";
      case "Thunderstorm": return "⛈️";
      case "Snow": return "❄️";
      case "Atmosphere": return "🌫️";
      default: return "⛅";
    }
  };

  const { currentWeather, loading, unit } = useSelector((state) => state.weather)

  const convertTemp = (temp) => {
    if (unit === 'F') return Math.round(temp * 9 / 5 + 32);
    return Math.round(temp);
  };

  if (loading || !currentWeather) {
    return <div className='currentweather'>날씨 정보를 불러오는중...</div>
  }

  const { name, main, weather, wind } = currentWeather;
  const weatherEmoji = getWeatherEmoji(weather[0].main)

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="currentweather">
      <div className="location">
        <p>CURRENT LOCATION</p>
        <h2>{name}</h2>
        <span>{dateString}</span>
      </div>
      <div className="icon">
        <span>{weatherEmoji}</span>
      </div>
      <div className="temp">
        <p>{convertTemp(main.temp)}</p>
        <span>°{unit}</span>
      </div>
      <div className="description">
        <p>{weather[0].description}</p>
      </div>
      <div className="detail">
        <div className="box">
          <div className="text">
            <p>체감</p>
            <span>{convertTemp(main.feels_like)}°{unit}</span>
          </div>
        </div>
        <div className="box">
          <div className="text">
            <p>풍속</p>
            <span>{wind.speed}m/s</span>
          </div>
        </div>
        <div className="box">
          <div className="text">
            <p>최고/최저</p>
            <span>{convertTemp(main.temp_max)}° / {convertTemp(main.temp_min)}°</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather