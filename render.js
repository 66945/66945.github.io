//Variables
var canvas = document.getElementById("canvas");
var PI = Math.PI;
var TAU = 2 * Math.PI;
var FILL = true;
var NOFILL = false;

var width = 0;
var height = 0;
//Math
function degToRad(deg){
	return deg * Math.PI / 180;
}

function radToDeg(rad){
	return rad / Math.PI * 180;
}

function map(value, oldScale, newScale){
	return (newScale / oldScale) * value;
}

function random(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

function dist(x1, y1, x2, y2){
	var newX = (x1 - x2) * (x1 - x2);
	var newY = (y1 - y2) * (y1 - y2);
	
	return Math.sqrt(newX + newY);
}

function Vector(x, y){
	this.x = x;
	this.y = y;
	
	this.addVector = function(v2){
		this.x += v2.x;
		this.y += v2.y;
	}
}
//RegEx
function getMatch(regex, text){
	var matches = [];
	
	while(regex.test(text)){
		matches.push(regex.exec(text)[1]);
		regex.compile(regex);
		
		text = text.replace(regex, "");
	}
	return matches;
}
//Mouse Control
var mouseX = 0;
var mouseY = 0;

function getCordinates(mouseEvent){
	mouseX = mouseEvent.screenX;
    mouseY = mouseEvent.screenY;
}

canvas.onmousemove = getCordinates;
//Rendering - Canvas
var ctx = canvas.getContext("2d");
var framerate;

function main(){
	start();
	framerate = setInterval(run, 10);
}

function run(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw();
}

main();

function setCanvas(x, y){
	canvas.width = x;
	canvas.height = y;
	width = x;
	height = y;
}

function translate(x, y){
	ctx.translate(x, y);
}

function rotateAngle(rotate){
	ctx.rotate(rotate * Math.PI / 180);
}

function push(){
	ctx.save();
}

function pop(){
	ctx.restore();
}

function setBackground(color){
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
	
}

function strokeWeight(weight){
	ctx.lineWidth = weight;
}

function setFill(color){
	ctx.fillStyle = color;
}

function setStroke(color){
	ctx.strokeStyle = color;
}

function setColor(color){
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
}

function rect(x, y, x2, y2){
	ctx.fillRect(x, y, x2 - x, y2 - y);
	ctx.strokeRect(x, y, x2 - x, y2 - y);
}

function circ(x, y, r){
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, r, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.closePath();
}

function arc(x, y, r, deg, mode, fill){
	if(mode == "fill"){
		ctx.beginPath();
	}
	ctx.moveTo(x, y);
	if(mode == "outline"){
		ctx.beginPath();
	}
	ctx.lineCap = "round";
	ctx.arc(x, y, r, 0, deg, true);
	if(fill){
		ctx.fill();
	}else{
		ctx.stroke();
	}
	ctx.closePath();
}

function line(x1, y1, x2, y2){
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}

function polygon(points){
	ctx.beginPath();
	for(var i = 0; i < points.length; i++){
		ctx.lineTo(points[i].x, points[i].y);
		ctx.moveTo(points[i].x, points[i].y);
	}
	
	ctx.lineTo(points[0].x, points[0].y);
	ctx.closePath();
	
	ctx.stroke();
	ctx.fill();
}

//Time
function currentSec(){
	var now = new Date();
	return now.getSeconds();
}

function currentMin(){
	var now = new Date();
	return now.getMinutes();
}

function currentHour(){
	var now = new Date();
	return now.getHours();
}