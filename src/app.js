var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    firmata = require('firmata');

// Setup server, sockets, and events

server.listen(8000);

app.use(express.static('src'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', function(socket){
  socket.emit('hello', 'tiger');
  socket.on('browser', function(data){
    console.log(data);
  });

  // socket.on('board object', function(data){
  //   var board;

  //   socket.on('blink', function(){
  //     var fn = function(err){
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }

  //       var ledPin = data.pin;

  //       console.log("connected");
  //       console.log(ledPin);
  //       console.log(board.pins);

  //       var ledOn = true;
  //       board.pinMode(ledPin, board.MODES[data.mode]);

  //       setInterval(function() {
  //         if (ledOn) {
  //           console.log("+");
  //           board.digitalWrite(ledPin, board.HIGH);
  //         } else {
  //           console.log("-");
  //           board.digitalWrite(ledPin, board.LOW);
  //         }

  //         ledOn = !ledOn;

  //       }, 500);
  //     };
      
  //     board = new firmata.Board(data.port, fn);
  //   });
  // });
  
  var board, boardData;

  socket.on('board object', function(data){
    boardData = data;
    board = new firmata.Board(data.port, function(err){
      if (err) {
        throw new Error(err);
      }
      console.log('FIRST TIME', board);
    });
  });

  socket.on('blink', function(data){
    var ledPin = boardData.pin;

    console.log("connected");

    var ledOn = true;
    console.log(ledPin);
    console.log('SECOND TIME', board);
    board.pinMode(ledPin, board.MODES[boardData.mode]);
    // board.pinMode.call(board,ledPin, board.MODES[boardData.mode]);

    setInterval(function() {
      if (ledOn) {
        console.log("+");
        board.digitalWrite(ledPin, board.HIGH);
      } else {
        console.log("-");
        board.digitalWrite(ledPin, board.LOW);
      }

      ledOn = !ledOn;

    }, 500);
  });




}); 