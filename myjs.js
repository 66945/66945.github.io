    var canvas = document.getElementById("amimation");
    var ctx = canvas.getContext("2d");
    var background = canvas.getContext("2d");
    var xplace=canvas.width/2;
    var direction=1;
    var speed=2;
    var angle=0;
    ctx.textAlign = "center";
    setInterval(drawText, 10);
    
    function drawText(){
        if(xplace>=canvas.width-55){
            direction=0;
        }else if(xplace<=55){
            direction=1;
        }
    
        if(direction===1){
            xplace+=speed;
        }else if(direction===0){
            xplace-=speed;
        }
        if(direction<2){
            angle++;            
        }
        background.fillStyle = "#000000";
        background.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#FF0000";
        ctx.font = "60px Courier new";
        ctx.save();
        ctx.translate(xplace, canvas.height/2);
        ctx.rotate(angle/20);
        ctx.fillText("MOO", 0, 0);
        ctx.restore();
    }
    
    function cow(){
	var x = document.body.contentEditable=true;
    }
    
    function freeze(){
        direction=2;
    }