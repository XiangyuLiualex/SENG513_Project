//create necessary express http server, and use socket io inside the server
let express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io,
    path = require("path");
app.get('/', function (req, res) {//sends client html file at connection
    res.sendFile(path.join(__dirname + '/client/game.html'));
});

app.use(express.static(__dirname + '/client'));//find other client side files here
server = http.Server(app);
server.listen(3000);//server listening to local host port 3000
io = socketIO(server);//build a scoket io server based on express http server

//Section: In Room Server-Client Communication
//The following code allows the server side to listen/response to client side
//The following code only handles in room canvas logic
//The following code currently assume there is only 1 room

let history = [];//need to modify to multi-room version
io.on('connection', async (socket) => {
    //sync the canvas history to new user
    for (let item of history)
        socket.emit('draw', item);
    socket.on('update', (data) => {//need to modify to multi-room version
        history.push(data);
        socket.emit('draw',data);
    })
})