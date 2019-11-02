let dir;

let x;
let deg;

function start(){
	//Setup the animation
	dir = 1;

	x = 80;
	deg = 0;

	setCanvas(500, 200);
	setFont("50px Courier new");

	//setup the projects
	loadProjects();
}

function draw(){
	setColor("#462A13");
	
	push();
	translate(x, height / 2);
	rotateAngle(deg);
	text(0, 0, "66945");
	pop();
	
	if(x >= 430){
		dir = -1;
	}else if(x <= 80){
		dir = 1;
	}
	
	x += dir;
	deg += 1;
}