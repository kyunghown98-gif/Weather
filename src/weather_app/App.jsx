import React, { useEffect } from 'react'
import './App.css'
import './css/media.css'
import Header from './component/Header'
import HeaderMarquee from './component/HeaderMarquee'
import CurrentWeather from './component/CurrentWeather'
import HourlyForecast from './component/HourlyForecast'
import WeeklyForecast from './component/WeeklyForecast'
import WeatherGraph from './component/WeatherGraph'
import CityList from './component/CityList'
import { useDispatch, useSelector } from 'react-redux'
import { weatherAction } from './redux/weatherAction'
import Game from './component/Game'
import SideMarquee from './component/SideMarquee'
import Ootd from './component/Ootd'
import TodoList from './component/TodoList'

const App = () => {

  const dispatch = useDispatch()
  const theme = useSelector(state => state.weather.theme)

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      dispatch(weatherAction.weather(lat, lon))
    })
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div>
      <Header />
      <HeaderMarquee />
      <div className="main">
        <div className="main_i">
          {/* 왼쪽 열: 현재날씨 + Saved Cities */}
          <div className="list">
            <CurrentWeather />
            <CityList />
          </div>

          {/* 중앙 열: 날씨 정보 */}
          <div className="weather_infor">
            <HourlyForecast />
            <WeeklyForecast />
            <WeatherGraph />
          </div>

          {/* 오른쪽 열: 위젯들 */}
          <div className="widgets">
            <div className="widgets_f">
              <div className="box">
                <Game />
                <SideMarquee />
              </div>
              <Ootd />
              <TodoList />
            </div>
          </div>

          {/* 태블릿용: 왼쪽 열 하단에 표시될 게임/OOTD */}
          <div className="tablet-left-widgets">
            <div className="box">
              <Game />
              <SideMarquee />
            </div>
            <Ootd />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App