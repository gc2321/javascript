var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

function getWeather(callback) {
  var request = require('request');
  request.get("https://www.metaweather.com/api/location/9807/", function (error, response) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(response.body);
      callback(data.consolidated_weather[0].weather_state_name);
    }
  });
}

app.use(express.static('client'));

var io = require('socket.io')(server);

io.on('connection', function (socket) {

  socket.on('message', function (msg) {
    //Catch questions
    if(/\: \?/.test(msg)){
      console.log('Received Message: ', msg);

      // if enter "?time", get time
      if(/\:.*time/gi.test(msg)){
        socket.emit('message', new Date());
      // if genter ?weather, get weather
      }else if(/\:.*weather/gi.test(msg)){
          socket.emit('message', 'Getting weather from metaweather...');
          getWeather(function (weather) {
            socket.emit('message', weather);
          });

      // if genter calc 1 + 3, get 4
      } else if(/calc/gi.test(msg)){
        var results = /calc (\d+) ?\+ ?(\d+)/gi.exec(msg);
        var sum = Number(results[1]) + Number(results[2]);
        socket.emit('message', sum);
}
    }else{
      io.emit('message', msg);
    }
  });
});

server.listen(8080, function() {
  console.log('Chat server running');
});
