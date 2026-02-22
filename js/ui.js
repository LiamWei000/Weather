export function setTheme(hour){
  document.body.className = (hour >=6 && hour<18) ? "day" : "night";
}

export function drawChart(canvas, temps){
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = 150;

  ctx.clearRect(0,0,w,h);
  ctx.beginPath();
  ctx.lineWidth = 2;

  const max = Math.max(...temps);
  const min = Math.min(...temps);

  temps.forEach((t,i)=>{
    const x = (w/(temps.length-1))*i;
    const y = h - ((t-min)/(max-min||1))*h;
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });

  ctx.stroke();
}

export function render(state){
  const weatherDiv = document.getElementById("weather");

  const current = state.data.current_condition[0];
  const hourly = state.data.weather[0].hourly.slice(0,8);

  const temp = state.unit==="C"?current.temp_C:current.temp_F;
  const desc = current.weatherDesc[0].value;

  setTheme(new Date(current.localObsDateTime).getHours());

  weatherDiv.innerHTML = `
    <div class="weather-main">
      <div class="temp">${temp}°${state.unit}</div>
      <div>${desc}</div>
      <div>${state.city}</div>
    </div>

    <div class="hourly">
      <strong>Next Hours</strong>
      <canvas id="chart"></canvas>
    </div>

    <div class="daily">
      <h3>7-Day Forecast</h3>
      <div id="dailyGrid" class="daily-grid"></div>
    </div>
  `;

  const dailyGrid = document.getElementById("dailyGrid");
  state.data.weather.forEach(day=>{
    dailyGrid.innerHTML += `
      <div class="day-card">
        <div>${day.date}</div>
        <div>${state.unit==="C"?day.avgtempC:day.avgtempF}°${state.unit}</div>
      </div>
    `;
  });

  const temps = hourly.map(h=>
    state.unit==="C"?parseInt(h.tempC):parseInt(h.tempF)
  );

  drawChart(document.getElementById("chart"), temps);
}