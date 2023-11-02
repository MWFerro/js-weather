const apiKey = 'fff54ec72d8341459e1213730230111';
const ENTRY_LIMIT = 100;
const FETCH_INTERVAL = 2000;
const temperatureData = [];

let myChart;

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

  const temperatures = temperatureData.slice(-ENTRY_LIMIT).map((data) => data.temperature);

  if (myChart) {
    myChart.data.labels = Array.from({ length: temperatures.length }, (_, i) => i);
    myChart.data.datasets[0].data = temperatures;
    myChart.update();
  } else {
    const ctx = temperatureChart.getContext('2d');
    myChart = new Chart(ctx, {
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
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: ENTRY_LIMIT - 1,
          },
        },
      },
    });
  }
}

function fetchWeatherData() {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London`;
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const temperature = data.current.temp_c;
      const dateTime = new Date();

      temperatureData.push({ temperature, dateTime });

      if (temperatureData.length > ENTRY_LIMIT) {
        temperatureData.shift(); 
      }

      updateTable();
      updateChart();
      document.getElementById('current-temperature').textContent = `${temperature}°C`;
      setTimeout(fetchWeatherData, FETCH_INTERVAL);
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      setTimeout(fetchWeatherData, FETCH_INTERVAL);
    });
}

fetchWeatherData();
