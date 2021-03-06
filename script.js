let request = new XMLHttpRequest();
request.open('GET', 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json', true );
request.onreadystatechange = function () {
    if (request.readyState != 4) {
        return;
    }
    if (request.status == 200) {
        let object = JSON.parse(request.responseText);
        let countries = document.getElementById("countries");
        let cities = document.getElementById("cities");
        for (var key in object) {
            let option = document.createElement("option");
            if (key != "") {
                let option = document.createElement("option");
                option.textContent = key;
                countries.appendChild(option);
            }
            countries.onchange = function () {
                cities.textContent = "";
                for (let i = 0; i < object[countries.value].length; i++) {
                    let option = document.createElement("option");
                    option.textContent = object[countries.value][i];
                    cities.appendChild(option);
                }
            }
            cities.onchange = function () {
                let weatherRequest = new XMLHttpRequest();
                let url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + cities.value.toLowerCase() + '%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
                weatherRequest.open('GET', url, true);
                weatherRequest.onreadystatechange = function () {
                    if (weatherRequest.readyState != 4) {
                        return;
                    }
                    if (weatherRequest.status == 200) {
                        let weather = JSON.parse(weatherRequest.responseText);
                        console.log(weather);
                        let data = document.getElementById('data');
                        let sunrise = document.getElementById('sunrise');
                        let sunset = document.getElementById('sunset');
                        let temp = document.getElementById('temp');
                        if (weather.query.results.channel.lastBuildDate == undefined) {
                            data.textContent = 'Результатов нет'
                        }
                        else {
                            data.textContent = 'Дата: ' + weather.query.results.channel.lastBuildDate;
                            sunrise.textContent = 'Рассвет в ' + weather.query.results.channel.astronomy.sunrise;
                            sunset.textContent = 'Закат в ' + weather.query.results.channel.astronomy.sunset;
                            temp.textContent = 'Температура в градусах: ' + Math.floor(5 / 9 * (weather.query.results.channel.item.condition.temp - 32));
                        }
                    }
                    else {
                        alert(weatherRequest.status + ': ' + weatherRequest.statusCode);
                    }
                }
                data.textContent = '';
                sunrise.textContent = '';
                sunset.textContent = '';
                temp.textContent = '';
                    weatherRequest.send();
            }
        }
    }
    else {
        alert( request.status + ': ' + request.statusCode );
    }
}
request.send();