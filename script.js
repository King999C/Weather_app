// script.js
const apiKey = "1e3e8f230b6064d27976e41163a82b77";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const currentWeather = document.getElementById("currentWeather");
const cityDate = document.getElementById("cityDate");
const temperature = document.getElementById("temperature");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const weatherIcon = document.getElementById("weatherIcon");
const weatherMain = document.getElementById("weatherMain");
const forecastSection = document.getElementById("forecastSection");
const forecastCards = document.getElementById("forecastCards");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => alert("Location access denied or unavailable.")
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

async function fetchWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message);

    renderCurrentWeather(data);
    fetchForecast(city);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message);

    renderCurrentWeather(data);
    fetchForecast(data.name);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function renderCurrentWeather(data) {
  currentWeather.classList.remove("hidden");
  // cityDate.textContent = `${data.name} (${new Date().toLocaleDateString()})`;
  cityDate.innerHTML = `<img src="img/location.png" class="w-6 h-6 inline-block" />${data.name} (${new Date().toLocaleDateString()})`;
  // temperature.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
   temperature.innerHTML = `
    <img src="img/temp.png" class="w-6 h-6 inline-block" />
    Feels Like: ${Math.round(data.main.temp)} °C
  `;
  // wind.textContent = `Wind: ${Math.round(data.wind.speed)} m/s`;
  wind.innerHTML = `
    <img src="img/wind.png" class="w-6 h-6 inline-block" />
    Wind: ${Math.round(data.wind.speed)} m/s
  `;
  // humidity.textContent = `Humidity: ${data.main.humidity}%`;
  humidity.innerHTML = `
    <img src="img/humid.png" class="w-6 h-6 inline-block" />
    Humidity: ${data.main.humidity} %
  `;
  pressure.innerHTML = `
    <img src="img/pressure.png" class="w-6 h-6 inline-block" />
    Pressure: ${data.main.pressure} hPa
  `;
  gust.innerHTML = `
    <img src="img/gust.png" class="w-6 h-6 inline-block" />
    Gust: ${Math.floor(data.wind.gust)} km/h
  `;
  degree.innerHTML = `
    <img src="img/360.png" class="w-6 h-6 inline-block" />
    Degree: ${Math.round(data.wind.deg)} °D
  `;
  weatherMain.textContent = data.weather[0].main;

  const iconMap = {
    Clear: "sun.png",
    Clouds: "cloudy.png",
    Rain: "rain.png",
    Snow: "snow.png",
    Mist: "mist.png",
    Haze: "haze.png",
    Thunderstorm: "thunderstorm.png",
    Smoke: "smoke.png",
    Fog: "fog.png"
  };

  const weatherType = data.weather[0].main;
  weatherIcon.src = `img/${iconMap[weatherType] || "placeholder.png"}`;
}

async function fetchForecast(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== "200") throw new Error(data.message);

    forecastCards.innerHTML = "";
    forecastSection.classList.remove("hidden");

    const filtered = data.list.filter(f => f.dt_txt.includes("12:00:00"));

    filtered.forEach(forecast => {
      const card = document.createElement("div");
      card.className = "border-1 glass p-4 rounded shadow text-center";
      const date = new Date(forecast.dt_txt).toLocaleDateString();
      const icon = forecast.weather[0].main;
      const iconMap = {
        Clear: "sun.png",
        Clouds: "cloud.png",
        Rain: "rain.png",
        Snow: "snow.png",
        Mist: "mist.png",
        Haze: "haze.png",
        Thunderstorm: "thunderstorm.png",
        Smoke: "smoke.png",
        Fog: "fog.png"
      };
      card.innerHTML = `
        <h3 class="font-bold mb-2">${date}</h3>
        <img src="img/${iconMap[icon] || "placeholder.png"}" alt="Icon" class="w-10 h-10 mx-auto">
        <p class="mt-2">${Math.round(forecast.main.temp)}°C</p>
        <p class="text-sm">${forecast.weather[0].main}</p>
      `;
      forecastCards.appendChild(card);
    });
  } catch (error) {
    alert("Forecast error: " + error.message);
  }
}
