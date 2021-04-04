const apiKey = '281625cdaeed2a20b5e890f6857218cd';
var cityHeadingEl = document.querySelector("#city-heading")
var temperatureEl = document.querySelector("#temperature")
var humidityEl = document.querySelector("#humidity")
var windSpeedEl = document.querySelector("#wind-speed")
var uvIndexEl = document.querySelector("#uv-index")
var clrHistEl = document.querySelector("#clear-history")

//Today's date
var today = new Date();
console.log('today: ', today)


//----------------------------------------------------------
//Capture user input
var userFormEl = document.querySelector("#user-form")
var cityInputEl = document.querySelector("#city-input")

var formSubmitHandler = function (event) {
  var userCity = cityInputEl.value.trim();
  event.preventDefault();

  if (userCity) {
    console.log("selected City: " + userCity);
    //Save Search to Local Storage
    // localStorage.setItem("search", userCity);

    var citySearched = {
      search: userCity
    }
    var cities = localStorage.getItem("search");
    if (cities === null) {
      cities = [];
    }
    else {
      cities = JSON.parse(cities);
    }
    cities.push(citySearched);
    cities = JSON.stringify(cities);
    localStorage.setItem("search", cities);

    renderWeather(userCity);
    renderHistory();
  }
};

//----------------------------------------------------------
//Render Weather
var renderWeather = function (city) {


  //Render current Day-------------------------------
  var todayFormatted = today.getMonth() + '/' + today.getDay() + '/' + today.getFullYear()
  let todayURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
  fetch(todayURL)
    .then(function (response) {
      response.json().then(function (todayData) {

        //Add City Name
        var todayCityEl = document.createElement("span");
        cityHeadingEl.innerHTML = " "
        var weatherIcon = 'http://openweathermap.org/img/wn/' + todayData.weather[0].icon + '@2x.png'
        todayCityEl.innerHTML = todayData.name + " (" + todayFormatted + ') <img src="' + weatherIcon + '">';
        cityHeadingEl.appendChild(todayCityEl)

        //Add Temperature
        var todayTempEl = document.createElement("span");
        temperatureEl.innerHTML = " "
        todayTempEl.innerHTML = 'Temperature: ' + Math.round(todayData.main.temp) + '&#8457;';
        temperatureEl.appendChild(todayTempEl)

        //Add Humidity
        var todayHumidityEl = document.createElement("span");
        humidityEl.innerHTML = " "
        todayHumidityEl.innerHTML = 'Humidity: ' + todayData.main.humidity + '%';
        humidityEl.appendChild(todayHumidityEl)

        //Add Wind Speed
        var todayWindEl = document.createElement("span");
        windSpeedEl.innerHTML = " "
        todayWindEl.innerHTML = 'Wind Speed: ' + todayData.wind.speed + ' MPH';
        windSpeedEl.appendChild(todayWindEl)

        console.log(todayData)
      })
    })

  //Render 5-Day Forecast-------------------------------
  let fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=imperial';
  fetch(fiveDayURL)
    .then(function (response) {
      response.json().then(function (fiveDayData) {

        var allForecastEl = document.querySelectorAll(".forecast");
        for (var i = 0; i < allForecastEl.length; i++) {
          allForecastEl[i].innerHTML = " "
          var forecastIndex = i * 8 + 4
          //date
          // var incDate = today.getDate() + i + 1
          var dateStr = today.getMonth() + '/' + (today.getDay() + i + 1) + '/' + today.getFullYear()
          var dateEl = document.createElement("p")
          dateEl.innerHTML = dateStr
          allForecastEl[i].append(dateEl)
          //icon
          var weatherIconEl = document.createElement("img")
          weatherIconEl.setAttribute("src", 'http://openweathermap.org/img/wn/' + fiveDayData.list[forecastIndex].weather[0].icon + '@2x.png');
          allForecastEl[i].append(weatherIconEl)
          //temp
          var tempEl = document.createElement("p")
          tempEl.innerHTML = 'Temp: ' + Math.round(fiveDayData.list[forecastIndex].main.temp) + '&#8457;';
          allForecastEl[i].append(tempEl)
          //humidity
          var humidEl = document.createElement("p")
          humidEl.innerHTML = 'Humidity: ' + Math.round(fiveDayData.list[forecastIndex].main.humidity) + '%';
          allForecastEl[i].append(humidEl)
        }
        console.log('fiveday', fiveDayData)
      })
    })
}

//----------------------------------------------------------
//Render Search History
var renderHistory = function () {
  var listEl = document.querySelector(".history-list")
  var searchedCities = localStorage.getItem("search");
  searchedCities = JSON.parse(searchedCities);
  console.log('searches', searchedCities)

  if (searchedCities !== null) {
    for (var i = 0; i < searchedCities.length; i++) {
      var createLi = document.createElement("li");
      createLi.textContent = searchedCities[i].search
      listEl.appendChild(createLi);
    }
  }
}

//Clear Search History
clrHistEl.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

//Event listener for selecting city
userFormEl.addEventListener("submit", formSubmitHandler);