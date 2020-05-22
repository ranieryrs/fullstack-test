const express = require('express');
const request = require('request');
const http = require('http');
const app = express();
const port = 3000;
const clientIDSpotify = '9edf982bc9f840c4a3f2a80bd92012e3';
const clientSecretSpotify = '2878ba824bac4c8982765031a1b8e7fa';
const keyOpenWeatherMap = '6a615174e59f1823c61b649129747405';

function getlocation(location) {
    return new Promise(resolve => {
        let urlTemperature = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=' + keyOpenWeatherMap;
        request({url: urlTemperature},
            function (error, response, body) {
                let res =JSON.parse(body);
                if(res.hasOwnProperty('message')){
                   console.log('Error: '+res.message);
                   resolve(false);
                }else{
                    resolve(res.main.temp);
                }
            }
        );
    });
}
function getToken() {
    return new Promise(resolve => {
        let urlToken = 'https://accounts.spotify.com/api/token?grant_type=client_credentials';
        let buffer = new Buffer.from(clientIDSpotify + ':' + clientSecretSpotify);
        let apiSpotifyKey = buffer.toString('base64');
        let header = {'Authorization': 'Basic ' + apiSpotifyKey, 'Content-Type': 'application/x-www-form-urlencoded'};
        request.post({url: urlToken, headers: header},
            function (error, response, body) {
                resolve(JSON.parse(body).access_token);
            }
        );

    });
}
function getPlaylist(typeMusic,accessToken) {
    return new Promise(resolve => {
        var url = 'https://api.spotify.com/v1/search?q=genre:%22' + typeMusic + '%22&type=track';
        var header = {'Authorization': 'Bearer ' + accessToken};
        request({url: url, headers: header},
            function (error, response, body) {
                resolve(body);
            }
        );
    });
}
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/playlist/:location", async  function (req, res,next) {
    let temperature = await getlocation(req.params.location);
    if(temperature){
        //convert kelvin to celsius
        temperature= temperature-273.15;
        let typeMusic=null;
        if(temperature>30){
            typeMusic="Party";
        }else if(temperature>=15){
            typeMusic="Pop";
        }else if(temperature>=10){
            typeMusic="Rock";
        }else {
            typeMusic="Classical";
        }
        let accessToken =await  getToken();
        let playlist = await getPlaylist(typeMusic,accessToken);
        res.send(playlist);
    }else{
        res.send(false);
    }

});

app.listen(port, () => console.log(`http://localhost:${port}`));