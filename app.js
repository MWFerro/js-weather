const apiKey = 'fff54ec72d8341459e1213730230111';

function fetchWeatherData() {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.current.temp_c;
      const dateTime = new Date(data.location.localtime);

      document.getElementById('current-temperature').textContent = `${temperature}°C`;

      setTimeout(fetchWeatherData, 10000);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

fetchWeatherData();
