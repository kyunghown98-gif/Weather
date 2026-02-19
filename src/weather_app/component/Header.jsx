import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { weatherAction } from '../redux/weatherAction'
import { toggleTheme, setUnit } from '../redux/slice'
import '../css/header.css'

const Header = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const theme = useSelector(state => state.weather.theme)
  const unit = useSelector(state => state.weather.unit)

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim() === '') return
    dispatch(weatherAction.searchAndSwitch(input.trim()))
    setInput('')
  }

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <header>
      <div className="header_i">
        <div className="logo">
          <h1>
            <a href="#">WEATHER</a>
          </h1>
        </div>
        <div className="search">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder='Search city... 도시 검색'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">🔎</button>
          </form>
        </div>

        <div className="header_r">
          <div className={`theme-toggle ${theme}`} onClick={handleToggle}>
            <div className="toggle-thumb">
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </div>
          <div className="unit_change">
            <button
              className={unit === 'C' ? 'active' : ''}
              onClick={() => dispatch(setUnit('C'))}
            >°C</button>
            <button
              className={unit === 'F' ? 'active' : ''}
              onClick={() => dispatch(setUnit('F'))}
            >°F</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header