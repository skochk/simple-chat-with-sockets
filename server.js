var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);


function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('new-user',data=>{
      console.log(data);
      socket.broadcast.emit('new-user-online',`${new Date().toLocaleTimeString('en-GB', { hour: "numeric", 
    minute: "numeric"})}: new cooking gay connected as:  ${data.username}<br>`);
  });

  socket.on('send-message',data=>{
      socket.broadcast.emit('show-new-message', `${new Date().toLocaleTimeString('en-GB', { hour: "numeric", 
    minute: "numeric"})}: ${data.username}: ${data.text}<br>`);
  });

  socket.on('user-left', data=>{
      socket.broadcast.emit('show-new-message',`${new Date().toLocaleTimeString('en-GB', { hour: "numeric", 
    minute: "numeric"})}:user left:  ${data.username}<br>`);
      console.log('user left: '+  data.username);
  });
});