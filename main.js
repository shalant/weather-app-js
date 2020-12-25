//----------------function to generate current city weather (AJAX 1)--------------------

function searchCity(cityname) {

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&units=imperial&APPID=cf6f1b533f8a2d8a189be4373c2681ff';
    var queryURLforecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityname + '&units=imperial&APPID=cf6f1b533f8a2d8a189be4373c2681ff';

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        //create div for displaying current city weather
        $("#current").empty();
        var mainDate = moment().format('L');

    //create text for city info: city name, date, temp, humidity, windspeed
    var cityNameEl = $("<h2>").text(response.name);
    var displayMainDate = cityNameEl.append(" " + mainDate);
    var tempEl = $('<p>').text('Temperature: ' + response.main.temp);
    var humidityEl = $('<p>').text('Humidity: ' + response.main.humidity);
    var windspeedEl = $('<p>').text('Wind Speed:' + response.wind.speed);
    var currentWeather = response.weather[0].main;

    //associates an icon with corresponding weather conditions in current city
    if (currentWeather === 'Rain') {
        var currentIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/09d.png');
        currentIcon.attr('style', 'height: 50px; width: 50px');
    } else if (currentWeather === 'Clouds') {
        var currentIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/03d.png');
        currentIcon.attr('style', 'height: 50px; width: 50px');
    } else if (currentWeather === "Clear") {
        var currentIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/01d.png');
        currentIcon.attr('style', 'height: 50px; width: 50px');
    } else if (currentWeather === 'Drizzle') {
        var currentIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/10d.png');
        currentIcon.attr('style', 'height: 50px; width: 50px');
    } else if (currentWeather === 'Snow') {
        var currentIcon = $('<img>').attr('src', 'http://openweathermap.org/img/win/13d.png');
        currentIcon.attr('style', 'height: 50px; width: 50px');
    }

    var weatherDiv = $('<div>');

    weatherDiv.append(displayMainDate, currentIcon, tempEl, humidityEl, windspeedEl);

    $('#current').html(weatherDiv);



//-----------------UV data AJAX call (AJAX #2)---------------------//

var lat = response.coord.lat;
var lon = response.coord.lon;
var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&APPID=cf6f1b533f8a2d8a189be4373c2681ff&lat=" + lat + "&lon=" + lon;

    $.ajax({
        url: queryURLUV,
        method: 'GET'
    }).then(function (response) {
        $('#uv-display').empty();
        var uvresults = response.value;
        //creates text for new div for UV data
        var uvEl = $("<button class='btn bg-success'>").text('UV Index: ' + response.value);

        $('#uv-display').html(uvEl);

    });
});


//----------------------------5-day forecast AJAX Call (AJAX #3)------------

$.ajax({
    url: queryURLforecast,
    method: 'GET'
}).then(function (response) {
    //storing the list of results from the response
    var results = response.list;
    //empty 5-day forecast div//
    $('#5day').empty();
    for (var i = 0; i < results.length; i += 8) {
        var fiveDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");

//captuing the responses date, temp, and humidity
        var date = results[i].dt_txt;
        var setD = date.substr(0,10);
        var temp = results[i].main.temp;
        var hum = results[i].main.humidity;

        //creates text for temp, hum, date
        var h5date = $("<h5 class='card-title'>").text(setD);
        var pTempt = $("<p class='card-text'>").text('Temp: ' + temp);
        var pHum = $("<p class='card-text'>").text('Humidity ' + hum);

        var weather = results[i].weather[0].main
        //associates an icon with corresponding weather conditions for 5 day forecast
        if (weather === 'Rain') {
            var icon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/09d.png');
            icon.attr('style', 'height: 40px; width: 40px');
        } else if (weather === 'Clouds') {
            var icon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/03d.png');
            icon.attr('style', 'height: 40px; width: 40px');
        } else if (weather === "Clear") {
            var icon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/01d.png');
            icon.attr('style', 'height: 40px; width: 40px');
        } else if (weather === 'Drizzle') {
            var icon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/10d.png');
            icon.attr('style', 'height: 40px; width: 40px');
        } else if (weather === 'Snow') {
            var icon = $('<img>').attr('src', 'http://openweathermap.org/img/win/13d.png');
            icon.attr('style', 'height: 40px; width: 40px');
        }




        //appending items to 5 day forecast empty div
        fiveDiv.append(h5date);
        fiveDiv.append(icon);
        fiveDiv.append(pTempt);
        fiveDiv.append(pHum);
        $('#5day').append(fiveDiv);
    }

});



}
pageLoad();
//--------------------------event handler for user's city search input-------------

$('#select-city').on('click', function (event) {
    //preventing default behaviour
    event.preventDefault();
    //storing the city name
    var cityInput = $('#city-input').val().trim();

    //saving the searched city to local storage
    var textContent = $(this).siblings('input').val();
    var cityarr = [];
    cityarr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(cityarr));

    searchCity(cityInput);
    pageLoad();
});

//-------------------calling stored search item to display once page loads-------------------

//retrieving last searched city from local storage
function pageLoad () {
    var lastCity = JSON.parse(localStorage.getItem('cityName'));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastCity);
    var previoussearch = $('<div>');
    previoussearch.append(searchDiv);
    $('#history').prepend(previoussearch);
}

//event handler for history
$('#history').on('click', '.btn', function(event) {
    event.preventDefault();
        searchCity($(this).text());

});

// const api = {
//     key: "cf6f1b533f8a2d8a189be4373c2681ff",
//     base: "https://api.openweathermap.org/data/2.5"
// }

// const searchbox = document.querySelector('.search-box');
// searchbox.addEventListener('keypress', setQuery);

// function setQuery(evt) {
//     if (evt.keyCode === 13) {
//         getResults(searchbox.value);
//         console.log(searchbox.value);
//     }
// }

// function getResults (query) {
//     fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
//     .then(weather => {
//         return weather.json();
//     }).then(displayResults);
// }

// function displayResults (weather) {
//     console.log(weather)
//     let city = document.querySelector('.location .city');
//     city.innerText = `${weather.name}, ${weather.sys.country}`;

//     let now = new Date();
//     let date = document.querySelector('.location .date');
//     date.innerText = dateBuilder(now);

//     let temp = document.querySelector('.current .temp')
//     temp.innerHTML = `${Math.round(weather.main.temp)}<span>C</span>`;

//     let weather_el = document.querySelector('.current .weather');
//     weather_el.innerText = weather.weather[0].main;

//     let hilow = document.querySelector('/hi-low');
//     hilow.innerText = `${weather.main.temp_min}C / ${weather.main.temp_max}C`;
// }

// function dateBuilder (d) {
//     let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
//     'Sep', 'Oct', 'Nov', 'Dec'];
//     let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     let day = days[d.getDay()];
//     let date = d.getDate();
//     let month = months[d.getMonths()];
//     let year = d.getFullYear();

//     return `${day} ${date} ${month} ${year}`;
