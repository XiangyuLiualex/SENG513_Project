/*
//---get room id from url----
let urlString = window.location.search;
let urlParams = new URLSearchParams(urlString);
let roomID = urlParams.get("roomId");
let username = urlParams.get("userName");

//--send room id to next page
window.location.href = "NEXT_PAGE.html"+"?roomId="+roomId+"$userName="+username;
*/


const socket = io('http://localhost:3000');
socket.on('draw', drawLine)
let HEIGHT, WIDTH, STROKE;
HEIGHT = 1000;
WIDTH = 1000;
STROKE = 5;
let drawing = false;
let updating = false;
let currentColor = 'black';
let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;
let canvasContext = canvas.getContext("2d");

canvasContext.strokeStyle = currentColor;
let colorButtons = document.getElementsByClassName('color_button');
Array.from(colorButtons).forEach((colorButton) => {
    colorButton.addEventListener('click', () => {
        currentColor = getComputedStyle(colorButton, null).getPropertyValue("background-color");
        console.log(currentColor)
        canvasContext.strokeStyle = currentColor;
        Array.from(colorButtons).forEach((button) => {
            button.style.border = 'grey none';
        })
        colorButton.style.border = 'grey solid';
    })
});
let strokeInput = document.getElementById('stroke_size');
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
    console.log('down')
});
window.addEventListener(myUp, e => {
    drawing = false;
});
canvas.addEventListener(myMove, e => {
    if (drawing) {
        console.log('move')
        let xInCanvas = e.clientX - canvas.getBoundingClientRect().left;
        let yInCanvas = e.clientY - canvas.getBoundingClientRect().top;
        console.log(currentColor)
        update(xOffset, yOffset, xInCanvas, yInCanvas, currentColor);
        toDB();
        xOffset = xInCanvas;
        yOffset = yInCanvas;
    }
})

function update(xStart, yStart, xEnd, yEnd, color) {
    socket.emit('update', JSON.stringify({ xStart, yStart, xEnd, yEnd, color }));
}
function toDB() {
    if (!updating) {
        socket.emit('toDB', JSON.stringify(canvas.toDataURL()))
        updating = true;
        setTimeout(() => {
            updating = false;
            socket.emit('toDB', JSON.stringify(canvas.toDataURL()))
        }, 1000)
    }
}
function drawLine(data) {//draw a line in canvas
    console.log('draw')
    data = JSON.parse(data);
    canvasContext.beginPath();
    canvasContext.moveTo(data.xStart, data.yStart);
    canvasContext.lineTo(data.xEnd, data.yEnd);
    canvasContext.strokeStyle = data.color;
    canvasContext.stroke();
    canvasContext.strokeStyle = currentColor;
}
/*socket.on('toDB', ()=>{
    socket.emit('toDB', JSON.stringify(canvas.toDataURL()))
})*/

socket.on('history', (data) => {
    if (data) {
        data = JSON.parse(data)
        let img = new Image;
        img.onload = function () {
            canvasContext.drawImage(img, 0, 0); // Or at whatever offset you like
        };
        img.src = data;
    }
})