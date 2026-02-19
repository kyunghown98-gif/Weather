import axios from "axios"
import { getWeather, getHourlyForecast, getWeeklyForecast, setLoading, setCityWeather, setSearchResults, setGameUser, setGameCom, setGameResult, updateGameScore } from "./slice";

const API_KEY = '66a0ab4dcf5f895d0b4df3f77c88297a'

// ✅ 주간 예보 파싱 로직을 별도 함수로 분리 (중복 제거)
const parseWeeklyForecast = (forecastData) => {
  const dailyData = {}

  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0]
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        weather: item.weather[0],
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        rainfall: 0,
      }
    }
    dailyData[date].temps.push(item.main.temp)
    // ✅ 실제 강수량 데이터 누적 (랜덤값 제거)
    dailyData[date].rainfall += (item.rain?.['3h'] || 0)
  })

  return Object.keys(dailyData).slice(0, 5).map(date => ({
    date,
    maxTemp: Math.round(Math.max(...dailyData[date].temps)),
    minTemp: Math.round(Math.min(...dailyData[date].temps)),
    weather: dailyData[date].weather,
    humidity: dailyData[date].humidity,
    windSpeed: dailyData[date].windSpeed,
    rainfall: Math.round(dailyData[date].rainfall * 10) / 10,
  }))
}

function weather(lat, lon) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true))

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        )
      ])

      dispatch(getWeather(currentRes.data))
      dispatch(getHourlyForecast(forecastRes.data))

      // ✅ 이미 가져온 forecastRes 데이터를 재사용 (추가 API 호출 불필요)
      const weeklyForecast = parseWeeklyForecast(forecastRes.data)
      dispatch(getWeeklyForecast(weeklyForecast))

    } catch (error) {
      console.error('날씨에러', error.response?.status, error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }
}

function fetchCityWeather(city) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
      )
      dispatch(setCityWeather({ id: city.id, data: response.data }))
    } catch (error) {
      console.error('도시 날씨 에러', city.name, error.message)
    }
  }
}

function searchCity(cityName) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      )
      dispatch(setSearchResults([{
        name: response.data.name,
        country: response.data.sys.country,
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      }]))
    } catch (error) {
      dispatch(setSearchResults([]))
      alert('도시를 찾을 수 없습니다.')
    }
  }
}

function searchAndSwitch(cityName) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true))

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        ),
        // ✅ 도시명으로 forecast도 동시 호출 (lat/lon 추출 후 재호출 불필요)
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
        )
      ])

      dispatch(getWeather(currentRes.data))
      dispatch(getHourlyForecast(forecastRes.data))

      // ✅ parseWeeklyForecast 재사용 (중복 코드 제거)
      const weeklyForecast = parseWeeklyForecast(forecastRes.data)
      dispatch(getWeeklyForecast(weeklyForecast))

    } catch (error) {
      console.error('도시 검색 에러', error.message)
      alert('도시를 찾을 수 없습니다.')
    } finally {
      dispatch(setLoading(false))
    }
  }
}

function fetchWeeklyForecast(lat, lon) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )

      // ✅ parseWeeklyForecast 재사용
      const weeklyForecast = parseWeeklyForecast(response.data)
      dispatch(getWeeklyForecast(weeklyForecast))

    } catch (error) {
      console.error('주간 예보 에러', error.message)
    }
  }
}

const gameItems = {
  rock: { name: '바위', emoji: '✊' },
  scissors: { name: '가위', emoji: '✌️' },
  paper: { name: '보', emoji: '🖐️' }
};

function playGame(choice) {
  return (dispatch) => {
    const user = gameItems[choice];

    const keys = Object.keys(gameItems);
    const randomKey = keys[Math.floor(Math.random() * 3)];
    const com = gameItems[randomKey];

    let result = '';
    if (user.name === com.name) {
      result = 'DRAW';
    } else if (
      (user.name === '바위' && com.name === '가위') ||
      (user.name === '가위' && com.name === '보') ||
      (user.name === '보' && com.name === '바위')
    ) {
      result = 'WIN';
    } else {
      result = 'LOSE';
    }

    dispatch(setGameUser(user));
    dispatch(setGameCom(com));
    dispatch(setGameResult(result));
    dispatch(updateGameScore(result));
  };
}

export const weatherAction = { weather, fetchCityWeather, searchCity, searchAndSwitch, fetchWeeklyForecast, playGame }