const socket = io('http://localhost:3000');
socket.on('draw', drawLine)
let HEIGHT, WIDTH, STROKE;
HEIGHT = 1000;
WIDTH = 1000;
STROKE = 5;
let drawing = false;
let currentColor = 'red';
let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;
let canvasContext = canvas.getContext("2d");
canvasContext.lineWidth = STROKE;
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
        update(xOffset, yOffset, xInCanvas, yInCanvas, currentColor);
        xOffset = xInCanvas;
        yOffset = yInCanvas;
    }
})

function update(xStart, yStart, xEnd, yEnd, color) {
    console.log('updae');
    socket.emit('update', JSON.stringify({ xStart, yStart, xEnd, yEnd, color }));
}
function drawLine(data) {//draw a line in canvas
    console.log('draw')
    data = JSON.parse(data);
    canvasContext.beginPath();
    canvasContext.moveTo(data.xStart, data.yStart);
    canvasContext.lineTo(data.xEnd, data.yEnd);
    canvasContext.strokeStyle = data.color;
    canvasContext.stroke();
}