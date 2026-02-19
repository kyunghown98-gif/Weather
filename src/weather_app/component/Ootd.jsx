import React from 'react'
import { useSelector } from 'react-redux'
import '../css/ootd.css'


const Ootd = () => {

  const outfitData = [
  { min: 28, max: 100, items: ['#SLEEVELESS', '#T-SHIRT', '#SHORTS'] },
  { min: 23, max: 27, items: ['#T-SHIRT', '#SHIRT', '#PANTS'] },
  { min: 20, max: 22, items: ['#CARDIGAN', '#LONGSLEEVE', '#JEANS'] },
  { min: 17, max: 19, items: ['#WINDBREAKER', '#SWEATSHIRT', '#SLACKS'] },
  { min: 12, max: 16, items: ['#JACKET', '#HOODIE', '#JEANS'] },
  { min: 9, max: 11, items: ['#COAT', '#UMBRELLA?', '#LAYERS'] },
  { min: 5, max: 8, items: ['#WOOLCOAT', '#THICKPANTS', '#SCARF'] },
  { min: -50, max: 4, items: ['#PADDING', '#THERMAL', '#GLOVES'] },
];

const tagColors = ['var(--yellow)', 'var(--red)','var(--yellow)' ];
const Colors = ['var(--red)', 'var(--yellow)','var(--red)' ];

  const { currentWeather, unit } = useSelector(state => state.weather)

  if (!currentWeather) {
    return <div className='ootd'>Loading...</div>
  }

  const tempC = Math.round(currentWeather.main.temp)
  const displayTemp = unit === 'F' ? Math.round(tempC * 9 / 5 + 32) : tempC
  const outfit = outfitData.find(o => tempC >= o.min && tempC <= o.max) || outfitData[outfitData.length - 1]

  return (
    <div className='ootd'>
      <div className='ootd-header'>
        <h2 className='ootd-title'># OOTD</h2>
        <span className='ootd-temp'>{displayTemp}°{unit}</span>
      </div>
      <div className='ootd-list'>
        {outfit.items.map((item, index) => (
          <div
            key={index}
            className='ootd-item'
            style={{ background: tagColors[index] }}
          >
            <span className='ootd-name'
            style={{color: Colors[index]}}
            >{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Ootd