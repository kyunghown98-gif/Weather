import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCity, removeCity, setShowSearch, setSearchInput, setSearchResults } from '../redux/slice'
import { weatherAction } from '../redux/weatherAction'
import '../css/citylist.css'

const CityList = () => {
    const dispatch = useDispatch()
    const {
        cityList, cityWeathers,
        showSearch, searchInput, searchResults ,unit
    } = useSelector((state) => state.weather)

    const convertTemp = (temp) => {
    if (unit === 'F') return Math.round(temp * 9 / 5 + 32);
    return Math.round(temp);
};


    useEffect(() => {
        cityList.forEach((city) => {
            dispatch(weatherAction.fetchCityWeather(city))
        })
    }, [cityList.length, dispatch])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (searchInput.trim() === '') return

        try {
            const API_KEY = '66a0ab4dcf5f895d0b4df3f77c88297a'
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}&units=metric`
            )
            const data = await response.json()

            if (data.cod !== 200) {
                alert('도시를 찾을 수 없습니다.')
                return
            }


            const isDuplicate = cityList.some(
                (city) => city.name.toLowerCase() === data.name.toLowerCase()
            )

            if (isDuplicate) {
                alert('이미 추가된 도시입니다!')
                return
            }

            const newCity = {
                id: Date.now(),
                name: data.name,
                lat: data.coord.lat,
                lon: data.coord.lon,
            }

            dispatch(addCity(newCity))
            handleCancel()
        } catch (error) {
            console.error('검색 에러', error)
            alert('도시를 찾을 수 없습니다.')
        }
    }

    const handleCityClick = (city) => {
        dispatch(weatherAction.weather(city.lat, city.lon))
    }

    const handleRemove = (e, id) => {
        e.stopPropagation()
        dispatch(removeCity(id))
    }

    const handleCancel = () => {
        dispatch(setShowSearch(false))
        dispatch(setSearchInput(''))
        dispatch(setSearchResults([]))
    }

    return (
        <div className="citylist">
            <div className="title">
                <h2>SAVED CITIES</h2>
            <span className='line'></span>
            </div>
            <div className="city_items">
                {cityList.map((city) => {
                    const weather = cityWeathers[city.id]
                    return (
                        <div
                            className="city_item"
                            key={city.id}
                            onClick={() => handleCityClick(city)}>
                            <div className="city_info">
                                <span className="city_name">{city.name}</span>
                                {weather && (
                                    <span className="city_temp">
                                        {convertTemp(weather.main.temp)}°{unit}
                                    </span>
                                )}
                            </div>
                            {weather && (
                                <img
                                    className="city_icon"
                                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                                    alt=""
                                />
                            )}
                            <button
                                className="city_remove"
                                onClick={(e) => handleRemove(e, city.id)} >
                                ❌
                            </button>
                        </div>
                    )
                })}
            </div>

            {cityList.length < 5 && !showSearch && (
                <div className="city_add" onClick={() => dispatch(setShowSearch(true))}>
                    <span>+ ADD</span>
                </div>
            )}

            {showSearch && (
                <div className="city_search">
                    <form className="search_input_wrap" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            value={searchInput}
                            onChange={(e) => dispatch(setSearchInput(e.target.value))}
                            autoFocus
                        />
                        <div className="btn">
                            <button type="submit">🔎</button>
                            <button type="button" className="cancel_btn" onClick={handleCancel}>
                                ❌
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CityList