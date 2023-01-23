
var socket = io();

const btn = document.getElementById('btn');
const usercontainer = document.getElementById('userlist');
const container = document.getElementById('message-container');
const message = document.getElementById('message-input');
const room = document.getElementById('room-input');
const sendButton = document.getElementById('send-button');
const roomButton = document.getElementById("room-button");
const username = document.getElementById("username");
const chatbox = document.getElementById("chatbox")
const taken = document.getElementById('taken');


username.focus();
// message.focus();

btn.addEventListener('click', ()=> {
    usercontainer.classList.toggle('reveal');
})

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
        taken.style.display = 'block';
    setTimeout(() => {
    taken.style.display = 'none';
    }, 1000);
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

socket.on('adduser', name=> {
    const div = document.createElement('div');
    div.innerText = name;
    div.classList.add("names")
    usercontainer.append(div);
})

socket.on('loadusers', names=> {
    const u = "<div>All Connected users:</div>";
    usercontainer.innerHTML = u;
    Object.keys(names).forEach(n=> {
        const div = document.createElement('div');
        div.classList.add("names")
        div.innerText = n;
        usercontainer.append(div);
    })
})

socket.on('reloadusers', names=> {
    usercontainer.innerHTML = "";
    
    const u = "<div>All Connected users:</div>";
    usercontainer.innerHTML = u;
    Object.keys(names).forEach(n=> {
        const div = document.createElement('div');
        div.classList.add("names")
        div.innerText = n;
        usercontainer.append(div);
    })
})