// HTML Elements
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

const temp = document.querySelector("#temp");
const city = document.querySelector("#city");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const weatherIcon = document.querySelector("#weatherIcon");

const loading = document.querySelector("#loading");
const error = document.querySelector("#error");

// Weather function
async function getWeather(cityName) {

    if (cityName.trim() === "") {
        alert("Please enter city name");
        return;
    }

    loading.style.display = "block";
    error.style.display = "none";

    try {

        // Step 1: Get Latitude & Longitude
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {
            loading.style.display = "none";
            error.style.display = "block";
            return;
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;
        const cityNameResult = geoData.results[0].name;

        // Step 2: Get Weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        loading.style.display = "none";

        // Update UI
        city.innerText = cityNameResult;
        temp.innerText = Math.round(weatherData.current.temperature_2m) + "°C";
        humidity.innerText = weatherData.current.relative_humidity_2m + "%";
        wind.innerText = Math.round(weatherData.current.wind_speed_10m) + " km/h";

        // Weather Icons
        const code = weatherData.current.weather_code;

        if (code === 0) {
            description.innerText = "Clear Sky";
            weatherIcon.src = "https://openweathermap.org/img/wn/01d@2x.png";
        }
        else if (code >= 1 && code <= 3) {
            description.innerText = "Cloudy";
            weatherIcon.src = "https://openweathermap.org/img/wn/03d@2x.png";
        }
        else if (code >= 45 && code <= 48) {
            description.innerText = "Fog";
            weatherIcon.src = "https://openweathermap.org/img/wn/50d@2x.png";
        }
        else if (code >= 51 && code <= 67) {
            description.innerText = "Rain";
            weatherIcon.src = "https://openweathermap.org/img/wn/10d@2x.png";
        }
        else if (code >= 71 && code <= 77) {
            description.innerText = "Snow";
            weatherIcon.src = "https://openweathermap.org/img/wn/13d@2x.png";
        }
        else if (code >= 80 && code <= 99) {
            description.innerText = "Thunderstorm";
            weatherIcon.src = "https://openweathermap.org/img/wn/11d@2x.png";
        }
        else {
            description.innerText = "Weather";
            weatherIcon.src = "https://openweathermap.org/img/wn/02d@2x.png";
        }

    }
    catch (err) {
        console.log(err);
        loading.style.display = "none";
        error.style.display = "block";
    }
}

// Search button
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value);
});

// Enter key
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getWeather(cityInput.value);
    }
});

// Default city
