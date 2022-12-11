//create necessary express http server, and use socket io inside the server
let sqlite3 = require("sqlite3");
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

let db = new sqlite3.Database('./public/mydb.db')
//when there is a socket io room opening, 
//set an 1 sec interval to ask the first user in the room 
//to send a canvas.toDataURL() to server and store it in db.
/*function historyDBUpdate() {
    Array.from(io.sockets.adapter.rooms).forEach(async room => {
        if(io.sockets.adapter.rooms.get(room[0]).size ==0){
            io.in(room[0]).socketsLeave(room[0]);
        }else{
            let mySockets = await io.in(room[0]).fetchSockets();
            mySockets[0].emit('toDB');
        }
    });
}
setInterval(historyDBUpdate, 1000);*/
//when user joins a room, 
//server sends the canvas url to client 
//and client use canvasContext.drawImage() to draw canvas history
let historyForDB = {};

io.on('connection', async (socket) => {
    //need to modify to multi-room version, 
    //the client need to know and store room id

    //--code to get roomID from client-------
    let roomID = 'test';
    //

    //join the default testing room
    socket.join(roomID);

    if (io.sockets.adapter.rooms.get(roomID).size > 0) {
        let mySockets = await io.in(roomID).fetchSockets();
        mySockets[0].emit('toDB');
        console.log('join');
    }

    //sync the canvas history to new user
    if(historyForDB[roomID]){
        socket.emit('history', historyForDB[roomID]);
    }
    /*let currentCanvasHostory = getCanvasHistory(roomID);
    if(currentCanvasHostory){
        socket.emit('history', currentCanvasHostory);
    }*/


    socket.on('update', (data) => {//need to modify to multi-room version
        //roomID = JSON.parse(data).roomID
        io.sockets.in(roomID).emit('draw',data);
    })
    socket.on('toDB', (data) => {// need to accept room id in the future-----------------------------------------------
        //roomID = JSON.parse(data).roomID
        historyForDB[roomID] = data;
        //updateCanvasHistory(data,roomID);
    })
})

function updateCanvasHistory(canvas, room){
    db.run('UPDATE room SET canvas_history = ? WHERE roomId =?',[canvas, room], function(err){
        if(err){
            console.log(err.message);
        }else{
            console.log('Room: '+room+', canvas history updated.');
        }
    })
}

function getCanvasHistory(room){
    let canvasHistory = null;
    db.run('SELECT canvas_history FROM room WHERE roomId = ?',[room],function(err,data){
        if(err){
            console.log(err.message);
        }else{
            canvasHistory = data;
        }
    })
    return canvasHistory;
}