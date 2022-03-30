const RESTDB_API_KEY = '622bc1bedced170e8c83a149';
const URL = 'https://mainpage-cee9.restdb.io/mail';

function sendContact() {
    let name = document.getElementById('name').value;
    let content = document.getElementById('content').value;

    if(name == "" || content == "")
        return;

    let reqBody = {
        "to": "66945@psdschools.org",
        "subject": "Contact from " + name,
        "html": '<p>' + content + '</p>',
        "company": "McGrath inc.",
        "sendername": name
    };

    document.getElementById('name').value = '';
    document.getElementById('content').value = '';

    let http = new XMLHttpRequest();
    http.open('POST', URL);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Cache-Control', 'no-cache');
    http.setRequestHeader('x-apikey', RESTDB_API_KEY);
    http.send(JSON.stringify(reqBody));

    document.getElementById('alert').style.display = 'block';
    setTimeout(fade, 3000);
}

function fade() {
    document.getElementById('alert').style.opacity = '0';
    setTimeout(hide, 750);
}

function hide() {
    document.getElementById('alert').style.display = 'none';
}