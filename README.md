# Michael Ferro - Weather App

This Weather App is a simple web application that allows users to check the current temperature for various locations. It provides a user-friendly interface with real-time temperature updates and a temperature chart.

## Features

- Select from six locations: London, Cairo, Kiev, New York, Tokyo, and Paris.
- View the current temperature for the selected location.
- See a temperature chart with a history of temperature data.
- The app fetches temperature data periodically, providing real-time updates.

## Usage

1. Clone or download this repository to your local machine.

2. Open the `index.html` file in a web browser. You can do this by copying the file path and pasting it into the browser's URL bar.

3. The app will load, and you'll see the "Weather App" title, the current temperature (initially set to London), a dropdown to select a location, a temperature chart, and a table with temperature history.

4. Use the dropdown to select a different location from the available options.

5. The app will automatically fetch the current temperature for the selected location and update the temperature chart and table.

6. The temperature data updates periodically every few seconds as set
   in the FETCH_INTERVAL constant in app.js, providing real-time temperature information
   for the selected location.

## File Structure

- `index.html`: The main HTML file for the Weather App.
- `app.js`: The JavaScript code that handles user interactions and temperature data fetching.
- `style.css`: The CSS file for styling the app.

## Technologies Used

- JavaScript
- jQuery
- Chart.js (for the temperature chart)
- HTML and CSS


