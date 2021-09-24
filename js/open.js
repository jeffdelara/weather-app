import APPID from './appid.js';

console.log("READY");

navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  
  fetchNameAndCountry({lat, lon});
}

const fetchNameAndCountry = ({lat, lon}) => {
  const name_fetch_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APPID}`
  
  fetch(name_fetch_url, { mode: 'cors'} )
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      const name = response[0].name;
      const country = response[0].country;
      fetchWeather({ name: name, country: country });
    })
}


const fetchWeather = ({name, country}) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${name},${country.toLowerCase()}&APPID=${APPID}`;

  fetch(url, { mode: 'cors'})
  .then((response) => {
    return response.json();
  }) 
  .then( (response) => {
    display(response);
  })
  .catch((err) => {
    console.log(err);
  })
}

const toCelsius = (kelvin) => {
  return (kelvin - 273.15).toFixed(2);
} 

const display = (response) => {
  console.log(response);
  const weather = response.weather[0];
  const icon = document.createElement('img');
  
  icon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  const temp = document.createElement('h2');
  temp.innerHTML = toCelsius(response.main.temp) + " &deg;C";
  
  const head = document.createElement('h1');
  const main = weather.main;
  head.innerHTML = main;

  const subtitle = document.createElement('h4');
  const sub = weather.description;
  subtitle.innerHTML = sub;

  const p = document.createElement('p');
  p.innerHTML = `${response.name}, ${response.sys.country}`;

  const div = document.createElement('div');
  div.setAttribute('id', 'weather');
  div.appendChild(icon);
  div.appendChild(temp);
  div.appendChild(head);
  div.appendChild(subtitle);
  div.appendChild(p);

  const container = document.getElementById("container");
  container.innerHTML = "";
  container.appendChild(div);
  
}