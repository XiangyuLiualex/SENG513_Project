
//---get room id from url----
let urlString = window.location.search;
let urlParams = new URLSearchParams(urlString);
const roomID = urlParams.get("roomID");
console.log(roomID)
const username = urlParams.get("userName");

/*
//--send room id to next page
window.location.href = "clientCanvas.html"+"?roomID="+roomID+"&userName="+username;
*/


const socket = io('http://localhost:4000');
socket.on('draw', drawLine)
let HEIGHT, WIDTH, STROKE;
HEIGHT = 1000;
WIDTH = 1000;
STROKE = 5;
let drawing = false;
let updating = false;
let currentColor = 'black';
let currentStroke;
let currentEraser = 'source-over';
let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;
document.getElementById('room_ID').innerText = 'Room: ' + roomID;
let canvasContext = canvas.getContext("2d");

canvasContext.strokeStyle = currentColor;
let subscribeStar = document.getElementById("subscribe_star").addEventListener('click', subscribe)
let homeButton = document.getElementById('back_home');
homeButton.addEventListener('click', () => {
    window.location.href = "homepage.html" + "?userName=" + username;
})
let eraser = document.getElementsByClassName('eraser')[0];

let colorButtons = document.getElementsByClassName('color_button');
let initialClorButton = document.getElementById('color_button_1');
initialClorButton.style.border = 'grey 4px solid';
Array.from(colorButtons).forEach((colorButton) => {
    colorButton.addEventListener('click', () => {
        currentColor = getComputedStyle(colorButton, null).getPropertyValue("background-color");
        canvasContext.strokeStyle = currentColor;
        currentEraser = 'source-over';
        Array.from(colorButtons).forEach((button) => {
            button.style.border = 'grey 4px none';
        })
        eraser.style.border = 'grey 4px none';
        colorButton.style.border = 'grey 4px solid';
    })
})
eraser.addEventListener('click', () => {
    currentColor = getComputedStyle(eraser, null).getPropertyValue("background-color");
    currentEraser = 'destination-out';
    Array.from(colorButtons).forEach((button) => {
        button.style.border = 'grey 4px none';
    })
    eraser.style.border = 'grey 4px solid';
})
let strokeInput = document.getElementById('stroke_size');
currentStroke = strokeInput;
canvasContext.lineWidth = strokeInput.value;
strokeInput.addEventListener('input', () => {
    canvasContext.lineWidth = strokeInput.value;
})
let myMove, myDown, myUp = "";
let xOffset, yOffset;
if ("ontouchstart" in document.documentElement) {
    //use touch events for touch screen
    myMove = "touchmove";
    myDown = "touchstart";
    myUp = "touchend";
} else {
    //use mouse events for none touch screen
    myMove = "mousemove";
    myDown = "mousedown";
    myUp = "mouseup";
};
canvas.addEventListener(myDown, e => {
    xOffset = e.clientX - canvas.getBoundingClientRect().left;
    yOffset = e.clientY - canvas.getBoundingClientRect().top;
    drawing = true;
});
window.addEventListener(myUp, e => {
    drawing = false;
});
canvas.addEventListener(myMove, e => {
    if (drawing) {
        let xInCanvas = e.clientX - canvas.getBoundingClientRect().left;
        let yInCanvas = e.clientY - canvas.getBoundingClientRect().top;
        update(xOffset, yOffset, xInCanvas, yInCanvas, currentColor, strokeInput.value, currentEraser);
        toDB();
        xOffset = xInCanvas;
        yOffset = yInCanvas;
    }
})

let saveButton = document.getElementById('save');
saveButton.addEventListener('click', () => {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.jpeg');
    canvas.toBlob(function(blob) {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
})

socket.emit('join', JSON.stringify({ room: roomID }));

function update(xStart, yStart, xEnd, yEnd, color, width, globalCompositeOperation) {
    socket.emit('update', JSON.stringify({ room: roomID, data: { xStart, yStart, xEnd, yEnd, color, width,  globalCompositeOperation} }));
}
function toDB() {
    if (!updating) {
        socket.emit('toDB', JSON.stringify({ room: roomID, data: canvas.toDataURL() }))
        updating = true;
        setTimeout(() => {
            updating = false;
            socket.emit('toDB', JSON.stringify({ room: roomID, data: canvas.toDataURL() }))
        }, 1000)
    }
}
function drawLine(data) {//draw a line in canvas
    canvasContext.beginPath();
    canvasContext.strokeStyle = data.color;
    canvasContext.lineWidth = data.width;
    canvasContext.globalCompositeOperation = data.globalCompositeOperation;
    canvasContext.moveTo(data.xStart, data.yStart);
    canvasContext.lineTo(data.xEnd, data.yEnd);
    canvasContext.stroke();
    //canvasContext.globalCompositeOperation = currentEraser;
}

socket.on('history', (data) => {
    if (data) {
        console.log('hist')
        let img = new Image;
        img.onload = function () {
            canvasContext.drawImage(img, 0, 0); // Or at whatever offset you like
        };
        img.src = data;
    }
})

async function subscribe() {
    console.log("User name: " + username + "\nRoom ID: " + roomID);

    const response = await fetch("/subscribed_rooms/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            roomId: roomID
        }),
    });
    // response.json().then(data => {
    response.json().then(data => {
        console.log(typeof data);
        if (data['stat'] == 1) {
            alert(data['content']);
            fecthHomepage();
        } else {
            alert(data['content']);
        }
        console.log(data);
    });
}