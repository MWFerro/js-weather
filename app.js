const apiKey = 'fff54ec72d8341459e1213730230111'; // only for this test - otherwise would use .env
const ENTRY_LIMIT = 100;
const FETCH_INTERVAL = 10000;

// initialize an array to store temperature data and a chart
let temperatureData = [];
let myChart;

$(document).ready(function () {
  // get a reference to the location dropdown element
  const locationDropdown = $('#location-dropdown');
  let currentLocation = 'London'; // Initialize default location

  // event handler for when a location is selected from the dropdown
  locationDropdown.change(function () {
    const selectedLocation = locationDropdown.val();
    currentLocation = selectedLocation;
    fetchWeatherData(currentLocation);
  });

  // update the temperature data table
  function updateTable() {
    const tableBody = $('#temperature-table');
    tableBody.empty();

    // create table rows
    for (let i = temperatureData.length - 1; i >= 0; i--) {
      const data = temperatureData[i];
      const row = $('<tr>');
      row.append($('<td>').text(data.dateTime.toLocaleString()));
      row.append($('<td>').text(data.location));
      row.append($('<td>').text(`${data.temperature}°C`));
      tableBody.append(row);
    }
  }

  // progressively update the temperature chart
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

  // fetch weather data from the API
  function fetchWeatherData(location) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
    $.get(apiUrl)
      .done((data) => {
        const temperature = data.current.temp_c;
        const dateTime = new Date();
        temperatureData.push({ temperature, dateTime, location });

        // Remove the oldest data if it exceeds the entry limit
        if (temperatureData.length > ENTRY_LIMIT) {
          temperatureData.shift();
        }

        updateTable();
        updateChart();

        // update displayed current temperature
        $('#current-temperature').text(`Current Temperature for ${location}: ${temperature}°C`);
      })
      .fail((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  locationDropdown.val(currentLocation);
  fetchWeatherData(currentLocation);

  // start data fetching at a specified interval
  function startRegularDataFetching() {
    setTimeout(() => {
      fetchWeatherData(currentLocation);
      startRegularDataFetching();
    }, FETCH_INTERVAL);
  }

  // Start the regular data fetching after the initial fetch
  startRegularDataFetching();
});
