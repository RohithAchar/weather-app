const input = document.querySelector('input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {
    getData(input.value);
});

const getData =  ( city ) => {
    const weatherObj = fetchWeather(city);
    weatherObj.then( (data) => {
        const name = data.location.region;
        const cloudCoverage = data.current.cloud;
        const precipitation = data.current.precip_in;
        const weather = determineWeatherCondition(cloudCoverage, precipitation);
    
        const localtime = data.location.localtime;
        const date = new Date(localtime);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        const temperature = data.current.temp_c + '\u00B0' + 'C';
        const humidity = data.current.humidity;
        const windSpeed = data.current.wind_kph + 'kmh';
        render( {
            weather,
            formattedDate,
            temperature,
            name,
            cloudCoverage,
            humidity,
            windSpeed
        } );
    }).catch( err => {
        console.log(err);
    })
}
getData('India');

async function fetchWeather( city ){
    try {
        const response = await fetch(`
        http://api.weatherapi.com/v1/current.json?key=0fa30492f55a4b099fb115124243101&q=${city}&aqi=no`);
        if(response.status === 400){
            throwError();
            return;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

function determineWeatherCondition(cloudCoverage, precipitation){
    if (cloudCoverage <= 10 && precipitation === 0) {
        return {
            condition: 'sunny',
            src: 'assets/sun-solid.svg'
        };
    } else if (cloudCoverage > 10 && precipitation <= 0.5) {
        return {
            condition: 'cloudy',
            src: 'assets/cloud-solid.svg'
        };
    } else if (cloudCoverage > 10 && precipitation > 0.5) {
        return {
            condition: 'rainy',
            src: 'assets/cloud-rain-solid.svg'
        };
    } else {
        return "Undefined"; // If conditions don't match the assumptions
    }
}

const render = ( data ) => {
    const weatherCondition = document.getElementById('weather-condition');
    const day = document.getElementById('date');
    const temperature = document.getElementById('temperature');
    const city = document.getElementById('city');
    const cloud = document.getElementById('cloud');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');

    weatherCondition.src = data.weather.src;
    day.textContent = data.formattedDate;
    temperature.textContent = data.temperature;
    city.textContent = data.name;
    cloud.textContent = data.cloudCoverage + '%';
    humidity.textContent = data.humidity + '%';
    wind.textContent = data.windSpeed;
    changeBackground(data.weather.condition);
}

const changeBackground = (condition) => {
    const background = document.querySelector('#wrapper');
    background.classList.remove(...background.classList);
    background.classList.add(condition);
}
function throwError(){
    alert('No matching place');
}