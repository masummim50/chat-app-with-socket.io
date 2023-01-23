const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

let users = {}
let names = {}


app.use(express.static(__dirname))

app.get("/", (req, res)=> {
    res.sendFile(__dirname+'/index.html')
})

io.on('connection', (socket)=> {
    // console.log(socket.id)
    socket.emit('loadusers', names);
    socket.on('sendtext', (msg)=> {
        // console.log(msg)
        msg.sender = users[socket.id];
        socket.broadcast.emit('displaytext', msg)
    })

    socket.on('setusername', name=> {
        if(users[name]){
            socket.emit('failed');
        }else{
            users[name] = socket.id;
            users[socket.id] = name;
            names[name] = name;
            const data = users;
            socket.emit('saved', data)
            io.emit('adduser', name);
            names[name] = name;
        }

    })

    socket.on('disconnect', () => {
        const name = users[socket.id];
        delete users[socket.id];
        delete users[name];
        delete names[name];
        io.emit('reloadusers', names);
    })
})



server.listen(3000, ()=> {
    console.log("server running")
})