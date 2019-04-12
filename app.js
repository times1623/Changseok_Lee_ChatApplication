var express = require('express');
var app = express();
var io = require('socket.io')();

const port = process.env.PORT || 3000;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

var currentusers = 0;

io.attach(server);

io.on('connection', function(socket) {
    console.log('new user has connected');
    ++currentusers;
   
    socket.emit('connected', { sID: `${socket.id}`} );
    io.emit('userconnect', { currentusers: currentusers });
    io.emit('joined', { notifications: "New User Joined" });


    // listen for an incoming message from anyone connected to the app
    socket.on('chat message', function(msg) {
        console.log('message: ', msg, 'socket:', socket.id);

        // send the message to everyone connected to the app
        io.emit('chat message', { id: `${socket.id}`, message: msg, notification: "new user has connected"});
    })

    socket.on('typing', function(name){
        io.emit('typing', name);
      });
      socket.on('stoptyping', function() {
        io.emit('typing');
      });

    socket.on('disconnect', function() {
        console.log('a user has disconnected');
        --currentusers;
        io.emit('userconnect', { currentusers: currentusers });
        io.emit('disconnect', {disconnection: "User Disconnected"});
    });
});