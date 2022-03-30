const RESTDB_API_KEY = '622bc1bedced170e8c83a149';
const URL = 'https://mainpage-cee9.restdb.io/rest';

const URL_PARAMS = new URLSearchParams(window.location.search);
const FORM_NAME = URL_PARAMS.get('id');

let body = document.getElementById('main');
let currentSurvey = {};

function getSurveyBody() { // TODO: Write actual request code
    let http = new XMLHttpRequest();

    http.addEventListener('load', function() {
        let response = JSON.parse(this.responseText)[0];
        currentSurvey = response.body;
        generateSurveyBody(response.body);
    });

    http.open('GET', URL + '/survey-content?q={"name": "' + FORM_NAME + '"}');
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Cache-Control', 'no-cache');
    http.setRequestHeader('x-apikey', RESTDB_API_KEY);
    http.send();
}

function generateSurveyBody(json) {
    let bodyStr= '<h1 id="survey-title">' + json["name"] + '</h1>';

    for(let question of json["questions"]) {
        let id = question["id"];

        bodyStr += '<div class="question">';
        bodyStr += '<h2>' + question["question"] + '</h2>';

        if(question["description"] != null)
            bodyStr += question["description"] + '<br>';

        let type = question["type"];
        switch(type) {
            case 'radio':
            case 'checkbox':
                bodyStr += addOptions(type, id, question["options"]);
                break;
            case 'short':
                bodyStr += '<input type="text" placeholder="Short answer" id="' + id + '">';
                break;
            case 'long':
                bodyStr += '<textarea placeholder="Long answer" id="' + id + '"></textarea>';
                break;
            default:
                console.log('invalid question type');
        }

        bodyStr += '</div>'
    }

    bodyStr += '<br>';
    bodyStr += '<div class="submit"><button onclick="submitForm()">Submit</button></div>';

    body.innerHTML = bodyStr;
}

function addOptions(type, id, options) {
    let optionsStr = '';
    for(let option of options) {
        optionsStr += '<input type="' + type + '" name="' + id + '" value="' + option + '">';
        optionsStr += '<label>&ThickSpace;' + option + '</label><br>';
    }

    return optionsStr;
}

function submitForm() {
    let response = getFormResponse();

    let request = {
        'survey-id': FORM_NAME,
        'email': '66945@psdschools.org', // TODO: add email support
        'response': response
    };

    let http = new XMLHttpRequest();
    http.open('POST', URL + '/survey-response');
    http.setRequestHeader("Content-Type", "application/json");
    http.setRequestHeader("x-apikey", RESTDB_API_KEY);
    http.send(JSON.stringify(request));

    body.style = "text-align:center;";
    body.innerHTML = '<h1>Thanks for participating!</h1>';
    body.innerHTML += '<a href="">Submit another response</a>';
}

function getFormResponse() {
    let response = [];

    for(let question of currentSurvey["questions"]) {
        let id = question["id"];
        let type = question["type"];

        let value = "";
        switch(type) {
            case 'radio':
                value = getRadioValue(id);
                break;
            case 'checkbox':
                value = getCheckValue(id);
                break;
            case 'short':
            case 'long':
                value = document.getElementById(id).value;
                break;
        }

        response.push({"id": id, "type": type, "value": value});
    }

    return response;
}

function getRadioValue(id) { // TODO: fix null case
    return document.querySelector('input[name="' + id + '"]:checked').value;
}

function getCheckValue(id) {
    let checkedValues = [];
    for(let element of document.querySelectorAll('input[name="' + id + '"]:checked'))
        checkedValues.push(element.value);
    
    return checkedValues;
}

getSurveyBody();