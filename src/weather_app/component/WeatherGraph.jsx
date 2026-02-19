import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGraphType } from '../redux/slice';
import '../css/weathergraph.css';

const WeatherGraph = () => {
  const dispatch = useDispatch();
  const graphType = useSelector(state => state.weather.graphType);
  const weeklyForecast = useSelector(state => state.weather.weeklyForecast);
  const unit = useSelector(state => state.weather.unit);

  const convertTemp = (temp) => {
    if (unit === 'F') return Math.round(temp * 9 / 5 + 32);
    return Math.round(temp);
  };

  const getDayName = (dateString) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const getGraphData = () => {
    if (!weeklyForecast) return [];

    switch (graphType) {
      case 'temperature':
        return weeklyForecast.map(day => convertTemp(day.maxTemp));
      case 'humidity':
        return weeklyForecast.map(day => day.humidity);
      case 'rainfall':
        // ✅ 실제 강수량 데이터 사용 (랜덤값 제거)
        return weeklyForecast.map(day => day.rainfall ?? 0);
      default:
        return weeklyForecast.map(day => convertTemp(day.maxTemp));
    }
  };

  if (!weeklyForecast || weeklyForecast.length === 0) {
    return (
      <div className='weathergraph'>
        <p style={{ color: '#fff' }}>주간 예보 데이터를 불러오는 중...</p>
      </div>
    );
  }

  const graphData = getGraphData();
  const maxValue = Math.max(...graphData);
  const minValue = Math.min(...graphData);
  const range = maxValue - minValue || 1;

  return (
    <div className='weathergraph'>
      <div className='graph-header'>
        <h2 className='graph-title'>OVERVIEW</h2>
        <div className='graph-tabs'>
          <button
            className={graphType === 'temperature' ? 'active' : ''}
            onClick={() => dispatch(setGraphType('temperature'))}
          >
            TEMPERATURE
          </button>
          <button
            className={graphType === 'humidity' ? 'active' : ''}
            onClick={() => dispatch(setGraphType('humidity'))}
          >
            HUMIDITY
          </button>
          <button
            className={graphType === 'rainfall' ? 'active' : ''}
            onClick={() => dispatch(setGraphType('rainfall'))}
          >
            RAINFALL
          </button>
        </div>
      </div>

      <div className='graph-container'>
        <svg className='graph-svg' viewBox='0 0 600 200' preserveAspectRatio='none'>
          <defs>
            <linearGradient id='areaGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor='#3a3a2a' stopOpacity='0.8' />
              <stop offset='100%' stopColor='#3a3a2a' stopOpacity='0.1' />
            </linearGradient>
          </defs>

          <path
            d={`
              M 0 ${200 - ((graphData[0] - minValue) / range) * 150}
              ${graphData.map((value, index) => {
                const x = (index / (graphData.length - 1)) * 600;
                const y = 200 - ((value - minValue) / range) * 150;
                return `L ${x} ${y}`;
              }).join(' ')}
              L 600 200
              L 0 200
              Z
            `}
            fill='url(#areaGradient)'
          />

          <path
            d={`
              M 0 ${200 - ((graphData[0] - minValue) / range) * 150}
              ${graphData.map((value, index) => {
                const x = (index / (graphData.length - 1)) * 600;
                const y = 200 - ((value - minValue) / range) * 150;
                return `L ${x} ${y}`;
              }).join(' ')}
            `}
            stroke='var(--marquee)'
            strokeWidth='3'
            fill='none'
          />

          {graphData.map((value, index) => {
            const x = (index / (graphData.length - 1)) * 600;
            const y = 200 - ((value - minValue) / range) * 150;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r='5'
                fill='var(--marquee)'
              />
            );
          })}
        </svg>

        <div className='graph-values'>
          {graphData.map((value, index) => {
            const x = (index / (graphData.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 75;
            return (
              <div
                key={index}
                className='graph-value'
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {graphType === 'temperature' ? `${value}°${unit}` :
                  graphType === 'humidity' ? `${value}%` :
                  `${value}mm`}
              </div>
            );
          })}
        </div>

        <div className='graph-labels'>
          {weeklyForecast.map((day, index) => (
            <div key={index} className='graph-label'>
              {getDayName(day.date)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherGraph;