const apiKey = 'fff54ec72d8341459e1213730230111';
const ENTRY_LIMIT = 100;
const FETCH_INTERVAL = 2000;
let temperatureData = [];
let myChart;

$(document).ready(function () {
  const locationDropdown = $('#location-dropdown');
  let currentLocation = 'London'; 

  locationDropdown.change(function () {
    const selectedLocation = locationDropdown.val();
    currentLocation = selectedLocation;
    fetchWeatherData(currentLocation);
  });

  function updateTable() {
    const tableBody = $('#temperature-table');
    tableBody.empty();

    for (let i = temperatureData.length - 1; i >= 0; i--) {
      const data = temperatureData[i];
      const row = $('<tr>');
      row.append($('<td>').text(data.dateTime.toLocaleString()));
      row.append($('<td>').text(data.location));
      row.append($('<td>').text(`${data.temperature}°C`));
      tableBody.append(row);
    }
  }

  function updateChart() {
    const temperatureChart = $('#temperature-chart')[0];
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

  function fetchWeatherData(location) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
    $.get(apiUrl)
      .done((data) => {
        const temperature = data.current.temp_c;
        const dateTime = new Date();
        temperatureData.push({ temperature, dateTime, location });

        if (temperatureData.length > ENTRY_LIMIT) {
          temperatureData.shift();
        }

        updateTable();
        updateChart();

        $('#current-temperature').text(`Current Temperature for ${location}: ${temperature}°C`);
      })
      .fail((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  locationDropdown.val(currentLocation);
  fetchWeatherData(currentLocation);

  function startRegularDataFetching() {
    setTimeout(() => {
      fetchWeatherData(currentLocation);
      startRegularDataFetching();
    }, FETCH_INTERVAL);
  }

  startRegularDataFetching();
});
