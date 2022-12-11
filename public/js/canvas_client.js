
//---get room id from url----
let urlString = window.location.search;
let urlParams = new URLSearchParams(urlString);
let roomID = urlParams.get("roomID");
console.log(roomID)
let username = urlParams.get("userName");

/*
//--send room id to next page
window.location.href = "NEXT_PAGE.html"+"?roomId="+roomId+"$userName="+username;
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
let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;
let canvasContext = canvas.getContext("2d");

canvasContext.strokeStyle = currentColor;
let homeButton = document.getElementById('back_home');
homeButton.addEventListener('click',()=>{
    window.location.href = "mainPage.html"+"?userName="+username;
})
let colorButtons = document.getElementsByClassName('color_button');
let initialClorButton = document.getElementById('color_button_1');
initialClorButton.style.border = 'grey 4px solid';
Array.from(colorButtons).forEach((colorButton) => {
    colorButton.addEventListener('click', () => {
        currentColor = getComputedStyle(colorButton, null).getPropertyValue("background-color");
        canvasContext.strokeStyle = currentColor;
        Array.from(colorButtons).forEach((button) => {
            button.style.border = 'grey 4px none';
        })
        colorButton.style.border = 'grey 4px solid';
    })
});
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
        update(xOffset, yOffset, xInCanvas, yInCanvas, currentColor, currentStroke);
        toDB();
        xOffset = xInCanvas;
        yOffset = yInCanvas;
    }
})

socket.emit('join', JSON.stringify({room: roomID}));

function update(xStart, yStart, xEnd, yEnd, color, width) {
    socket.emit('update', JSON.stringify({room: roomID, data: { xStart, yStart, xEnd, yEnd, color, width }}));
}
function toDB() {
    if (!updating) {
        socket.emit('toDB', JSON.stringify({room: roomID, data: canvas.toDataURL()}))
        updating = true;
        setTimeout(() => {
            updating = false;
            socket.emit('toDB', JSON.stringify({room: roomID, data: canvas.toDataURL()}))
        }, 1000)
    }
}
function drawLine(data) {//draw a line in canvas
    canvasContext.beginPath();
    canvasContext.strokeStyle = data.color;
    canvasContext.lineWidth = data.width;
    canvasContext.moveTo(data.xStart, data.yStart);
    canvasContext.lineTo(data.xEnd, data.yEnd);
    canvasContext.stroke();
}
/*socket.on('toDB', ()=>{
    socket.emit('toDB', JSON.stringify(canvas.toDataURL()))
})*/

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