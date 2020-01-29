let vec;
let scale;

function start(){
	vec = new Vector(0, 0);
	scale = 25;
	setCanvas(600, 600);
	translate(300, 300);
}

function draw(){
	//Grid
	for(let x = Math.floor(-((width / 2) / scale)); x < (width / 2) / scale; x++){
		for(let y = -(width / 2); y < height / scale; y++){
			strokeWeight(2);
			
			setStroke("black");
			setFill("grey");
			
			rect(x * scale, y * scale, x * scale + scale, y * scale +scale);
		}
	}

	//Axis
	setColor("darkgreen");
	strokeWeight(5);
	line(-(width / 2), 0, width / 2, 0);
	line(0, -(width / 2), 0, width / 2);
	
	//Vector line from origin
	setColor("red");
	strokeWeight(5);
	line(0, 0, vec.x * scale, vec.y * scale);
	
	preImage();
	postImage();
}

function parseVec(){
	let toParse = document.getElementById("vecVal").value;
	let x = parseFloat(/<(\-?[\d]*),/.exec(toParse)[1]);
	let y = parseFloat(/,\s?(\-?[\d]*)>/.exec(toParse)[1]);
	
	vec = new Vector(x, -y);
}

function preImage(){
	let points2 = [];
	
	setColor("blue");
	let points = document.getElementById("points").value.split("\n");
	for(let i = 0; i < points.length; i++){
		if(points[i].charAt(0) != "="){
			let x = parseFloat(/\(?(\-?[\d\.]*),/.exec(points[i])[1]);
			let y = parseFloat(/,(\-?[\d\.]*)\)?/.exec(points[i])[1]);
			
			circ(x * scale, -y * scale, 6);
			
			points2.push(new Vector(x * scale, -y * scale));
		}else{			
			let eq = parseEquation(points[i]);
			
			for(let x = Math.floor(-((width/2)/scale)); x < (width/2)/scale; x += 0.01){
				let y = eq.getY(x);
				
				circ(x * scale, -y * scale, 2);
			}
		}
	}
	
	if(points2.length != 0){
		polygon(points2);
	}
}

function postImage(){
	let points2 = [];
	
	setColor("red");
	let points = document.getElementById("points").value.split("\n");
	for(let i = 0; i < points.length; i++){
		if(points[i].charAt(0) != "="){
			let x = parseFloat(/\(?(\-?[\d\.]*),/.exec(points[i])[1]);
			let y = parseFloat(/,(\-?[\d\.]*)\)?/.exec(points[i])[1]);
			
			circ((x + vec.x) * scale, (-y + vec.y) * scale, 6);
			
			points2.push(new Vector((x + vec.x) * scale, (-y + vec.y) * scale));
		}else{
			let eq = parseEquation(points[i]);
			
			for(let x = Math.floor(-((width/2)/scale)); x < (width/2)/scale; x += 0.01){
				let y = eq.getY(x);
				
				circ((x + vec.x) * scale, (-y + vec.y) * scale, 2);
			}
		}
	}
	
	if(points2.length != 0){
		polygon(points2);
	}
}

function zoom(amount){
	scale += amount;
}

function parseEquation(eq){
	let terms = [];
	let nterms = [];
	
	let term = getMatch(/([\-\+\d\.]*x[\^\-\d]*)/, eq);
	for(let i = 0; i < term.length; i++){
		let k = parseFloat(/(\-?[\d\.]*)x/.exec(term[i])[1]);
		let b = 1;
		if(/x\^(\-?[\d\.]*)/.test(term[i])){
			b = parseFloat(/x\^(\-?[\d\.]*)/.exec(term[i])[1]);
		}
		
		terms.push(new Term(k, b));
		
		nterms.push(-k);
	}
	
	if(/([\+\-][\d\.]*)/.test(eq)){
		ns = getMatch(/([\+\-][\d\.]*)/, eq);
		for(let i = 0; i < ns.length; i++){
			nterms.push(parseFloat(ns[i]));
		}
	}
	
	return new Equation(terms, nterms);
}

class Term {
	constructor(k, b) {
		this.k = k;
		this.b = b;
	}
}

class Equation {
	constructor(terms, nterms) {
		this.terms = terms;
		this.nterms = nterms;
	}
}

Equation.prototype.getY = function(x) {
	let val = 0;

	for (let i = 0; i < this.terms.length; i++) {
		val += this.terms[i].k * Math.pow(x, this.terms[i].b);
	}

	for (let i = 0; i < this.nterms.length; i++) {
		val += this.nterms[i];
	}

	return val;
};