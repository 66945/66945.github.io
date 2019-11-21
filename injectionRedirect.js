const NINEPM = 18;

function redirect() {
    let date = new Date();

    if(date.getHours() >= NINEPM)
        location.replace("https://google.com/search?q=cats");
    else
        alert("Welcome to FCHS");
}

redirect();
