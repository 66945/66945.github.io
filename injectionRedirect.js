const NINEPM = 18;

redirect();

function redirect() {
    let date = new Date();

    if(date.getHours() >= NINEPM)
        location.replace("https://google.com/search?q=cats");
}