const apiKey = '0fb77c599638926341f8d8ed83aa27ad';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locateBtn = document.getElementById('locateBtn');
const currentEl = document.getElementById('currentWeather');
const forecastEl = document.getElementById('forecast');

searchBtn.addEventListener('click', () => {
  const q = cityInput.value.trim();
  if (q) searchByCity(q);
});

locateBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    });
  }
});

async function searchByCity(query) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`);
  const data = await res.json();
  console.log("data", data);
  if(data.cod === "404"){
	  alert(query + " " + data.message)
  }
  if (data.coord) {
    fetchWeatherByCoords(data.coord.lat, data.coord.lon);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();

  applyWeatherTheme(currentData.weather[0].main);
  displayCurrent(currentData);
  displayForecast(forecastData.list.slice(0, 6));
}

function displayCurrent(data) {
  const weather = data.weather[0].main;
  const emoji = getWeatherEmoji(weather);

  currentEl.innerHTML = `
    <h2>${emoji} ${data.name}</h2>
    <p>${weather} - ${data.weather[0].description}</p>
    <p>Temp: ${data.main.temp}°C</p>
    <p>Feels like: ${data.main.feels_like}°C</p>
    <p>Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
  `;

  // Smooth background transition
  const weatherType = weather.toLowerCase();
  const body = document.body;
  let gradient;

  switch (weatherType) {
  case "clear":
    gradient = "linear-gradient(to right, #fceabb, #f8b500)";
    break;
  case "clouds":
    gradient = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    break;
  case "rain":
  case "drizzle":
    gradient = "linear-gradient(to right, #4e54c8, #8f94fb)";
    break;
  case "thunderstorm":
    gradient = "linear-gradient(to right, #232526, #414345)";
    break;
  case "snow":
    gradient = "linear-gradient(to right, #e6dada, #274046)";
    break;
  case "mist":
  case "haze":
  case "fog":
    gradient = "linear-gradient(to right, #757f9a, #d7dde8)";
    break;
  default:
    gradient = "linear-gradient(135deg, #1e1e1e, #2c3e50)";
}


  body.style.transition = "background 1s ease";
  body.style.background = gradient;
}



function displayForecast(forecasts) {
  forecastEl.innerHTML = '<h3>Forecast</h3><div class="forecast-grid">' +
    forecasts.map(item => {
      const weather = item.weather[0].main;
      const emoji = getWeatherEmoji(weather);
      return `
        <div class="forecast-item">
          <p><strong>${emoji} ${new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
          <p>${weather} - ${item.weather[0].description}</p>
          <p>Temp: ${item.main.temp}°C</p>
        </div>
      `;
    }).join("") + '</div>';
}


function getWeatherEmoji(weather) {
  switch (weather.toLowerCase()) {
    case "clear": return "☀️";
    case "clouds": return "☁️";
    case "rain": return "🌧️";
    case "drizzle": return "🌦️";
    case "thunderstorm": return "⛈️";
    case "snow": return "❄️";
    case "mist":
    case "haze":
    case "fog": return "🌫️";
    default: return "🌡️";
  }
}


function applyWeatherTheme(weather) {
  const body = document.body;
  const lowercase = weather.toLowerCase();

  if (lowercase.includes("clear")) {
    body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
    body.style.color = "#222";
  } else if (lowercase.includes("clouds")) {
    body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    body.style.color = "#fff";
  } else if (lowercase.includes("rain") || lowercase.includes("drizzle")) {
    body.style.background = "linear-gradient(to right, #373B44, #4286f4)";
    body.style.color = "#fff";
  } else if (lowercase.includes("thunderstorm")) {
    body.style.background = "linear-gradient(to right, #141e30, #243b55)";
    body.style.color = "#fff";
  } else if (lowercase.includes("snow")) {
    body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
    body.style.color = "#000";
  } else {
    body.style.background = "#1e1e1e";
    body.style.color = "#fff";
  }
}