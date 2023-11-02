const apiKey = 'fff54ec72d8341459e1213730230111';

const temperatureData = [];

function updateTable() {
  const tableBody = document.getElementById('temperature-table');
  tableBody.innerHTML = '';

  for (let i = temperatureData.length - 1; i >= 0; i--) {
    const data = temperatureData[i];
    const row = tableBody.insertRow();
    const dateCell = row.insertCell(0);
    const tempCell = row.insertCell(1);
    dateCell.textContent = data.dateTime.toLocaleString();
    tempCell.textContent = `${data.temperature}°C`;
  }
}

function updateChart() {
  const temperatureChart = document.getElementById('temperature-chart');

  const temperatures = temperatureData.slice(-100).map((data) => data.temperature);

  const ctx = temperatureChart.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: temperatures.length }, (_, i) => i),
      datasets: [{
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: 'blue',
        borderWidth: 2,
      }],
    },
  });
}

function fetchWeatherData() {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London`; 
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.current.temp_c;
      const dateTime = new Date(data.location.localtime);

      temperatureData.push({ temperature, dateTime });

      if (temperatureData.length > 100) {
        temperatureData.shift();
      }
      updateTable();

      updateChart();

      document.getElementById('current-temperature').textContent = `${temperature}°C`;

      setTimeout(fetchWeatherData, 3000);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

fetchWeatherData();
