var vec;
var scale;

function start(){
	vec = new Vector(0, 0);
	scale = 25;
	setCanvas(600, 600);
	translate(300, 300);
}

function draw(){
	//Grid
	for(var x = Math.floor(-((width/2)/scale)); x < (width/2)/scale; x++){
		for(var y = -300; y < width/scale; y++){
			strokeWeight(2);
			
			setStroke("black");
			setFill("grey");
			
			rect(x * scale, y * scale, x * scale + scale, y * scale +scale);
		}
	}
	setColor("darkgreen");
	strokeWeight(5);
	line(-300, 0, 300, 0);
	line(0, -300, 0, 300);
	
	setColor("red");
	strokeWeight(5);
	line(0, 0, vec.x * scale, vec.y * scale);
	
	preImage();
	postImage();
}

function parseVec(){
	var toParse = document.getElementById("vecVal").value;
	var x = parseFloat(/<(\-?[\d]*),/.exec(toParse)[1]);
	var y = parseFloat(/,(\-?[\d]*)>/.exec(toParse)[1]);
	
	vec = new Vector(x, -y);
}

function preImage(){
	var points2 = [];
	
	setColor("blue");
	var points = document.getElementById("points").value.split("\n");
	for(var i = 0; i < points.length; i++){
		if(points[i].charAt(0) != "="){
			var x = parseFloat(/\(?(\-?[\d\.]*),/.exec(points[i])[1]);
			var y = parseFloat(/,(\-?[\d\.]*)\)?/.exec(points[i])[1]);
			
			circ(x * scale, -y * scale, 6);
			
			points2.push(new Vector(x * scale, -y * scale));
		}else{			
			var eq = parseEquation(points[i]);
			
			for(var x = Math.floor(-((width/2)/scale)); x < (width/2)/scale; x += 0.01){
				var y = eq.getY(x);
				
				circ(x * scale, -y * scale, 2);
			}
		}
	}
	
	if(points2.length != 0){
		polygon(points2);
	}
}

function postImage(){
	var points2 = [];
	
	setColor("red");
	var points = document.getElementById("points").value.split("\n");
	for(var i = 0; i < points.length; i++){
		if(points[i].charAt(0) != "="){
			var x = parseFloat(/\(?(\-?[\d\.]*),/.exec(points[i])[1]);
			var y = parseFloat(/,(\-?[\d\.]*)\)?/.exec(points[i])[1]);
			
			circ((x + vec.x) * scale, (-y + vec.y) * scale, 6);
			
			points2.push(new Vector((x + vec.x) * scale, (-y + vec.y) * scale));
		}else{
			var eq = parseEquation(points[i]);
			
			for(var x = Math.floor(-((width/2)/scale)); x < (width/2)/scale; x += 0.01){
				var y = eq.getY(x);
				
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
	var terms = [];
	var nterms = [];
	
	var term = getMatch(/([\-\+\d\.]*x[\^\-\d]*)/, eq);
	for(var i = 0; i < term.length; i++){
		var k = parseFloat(/(\-?[\d\.]*)x/.exec(term[i])[1]);
		var b = 1;
		if(/x\^(\-?[\d\.]*)/.test(term[i])){
			b = parseFloat(/x\^(\-?[\d\.]*)/.exec(term[i])[1]);
		}
		
		terms.push(new Term(k, b));
		
		nterms.push(-k);
	}
	
	if(/([\+\-][\d\.]*)/.test(eq)){
		ns = getMatch(/([\+\-][\d\.]*)/, eq);
		for(var i = 0; i < ns.length; i++){
			nterms.push(parseFloat(ns[i]));
		}
	}
	
	return new Equation(terms, nterms);
}

function Term(k, b){
	this.k = k;
	this.b = b;
}

function Equation(terms, nterms){
	this.terms = terms;
	this.nterms = nterms;
	
	this.getY = function(x){
		var val = 0;
		for(var i = 0; i < this.terms.length; i++){
			val += this.terms[i].k * Math.pow(x, this.terms[i].b);
		}
		
		for(var i = 0; i < this.nterms.length; i++){
			val += this.nterms[i];
		}
		
		return val;
	}
}