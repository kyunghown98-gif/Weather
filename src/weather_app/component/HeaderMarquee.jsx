import React, { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import '../css/HeaderMarquee.css'

const HeaderMarquee = () => {
  const [timeInfo, setTimeInfo] = useState({ date: '', time: '' });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      
      const day = days[now.getDay()];
      const mon = months[now.getMonth()];
      const date = now.getDate();
      const year = now.getFullYear();
      const h = String(now.getHours()).padStart(2,'0');
      const m = String(now.getMinutes()).padStart(2,'0');
      const s = String(now.getSeconds()).padStart(2,'0');

      setTimeInfo({
        date: `${day} ${mon} ${date}, ${year}`,
        time: `${h}:${m}:${s}`
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

 
  const messages = [
    `${timeInfo.date} — ${timeInfo.time}`,
    "DRESS FOR THE WEATHER NOT THE SEASON ☁️",
    "WEATHER. ® — CHECK BEFORE YOU STEP OUT ⚡",
    "오늘 뭐 입지? 날씨부터 확인 🔥",
    "STAY DRY STAY FLY 🌧️",
    "NO BAD WEATHER ONLY BAD OUTFITS"
  ];

  return (
    <div className="header-marquee">
      
      <Marquee speed={40} gradient={false}>
        {messages.map((msg, index) => (
          <span key={index}>
            {msg} —
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default HeaderMarquee;