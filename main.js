
var socket = io();



const container = document.getElementById('message-container');
const message = document.getElementById('message-input');
const room = document.getElementById('room-input');
const sendButton = document.getElementById('send-button');
const roomButton = document.getElementById("room-button");
const username = document.getElementById("username");
const chatbox = document.getElementById("chatbox")
username.focus();
// message.focus();

// this tries to set a username
username.addEventListener("keypress", (e)=> {
    if(e.key === 'Enter'){
        socket.emit('setusername', username.value);
    }
})

socket.on('saved', d=> {
    console.log(d);
    username.style.display = 'none';
    chatbox.style.display  = 'flex';
    message.focus();
})

socket.on('failed', ()=> {
    console.log('user name taken');
})

const dropmessage =()=> {
    const m = {
        msg: message.value
    };
    if(m=="") return;

    socket.emit('sendtext', m);
    displayMessage(m);
    message.value = "";
}

socket.on('displaytext', (msg)=> {
    displayMessage(msg);
})

sendButton.addEventListener('click', (e)=> {
    dropmessage();
})

message.addEventListener('keypress', e=> {
    if(e.key === 'Enter'){
        dropmessage();
    }
})

const displayMessage = (message)=> {
    const div = document.createElement('div');
    const msg = document.createElement('div');
    const sen = document.createElement('div');
    sen.style.fontSize = '15px';
    sen.style.color = 'grey';
    msg.classList.add('msg');
    div.classList.add('box');
    div.append(sen);

    if(message.sender){
        msg.innerText = `${message.msg}`;
        sen.innerText = message.sender;
        msg.style.backgroundColor = 'darkorange'
        div.style.textAlign = 'right'
        div.append(msg);
    }else{
        sen.innerText = "You"
        msg.innerText = message.msg;
        msg.style.backgroundColor = 'darkcyan';
        div.append(msg);

    }

    container.append(div);
    container.scrollTop = container.scrollHeight;
}