// This is f#@%ing awsome: https://rss2json.com/

const CNN   = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Frss.cnn.com%2Frss%2Fcnn_allpolitics.rss";
const FOX   = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.foxnews.com%2Ffoxnews%2Fpolitics";
const TIMES = "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml";
const ONION = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpolitics.theonion.com%2Frss";

const TIMES_RE  = /title>(.*)</g;

const MAX_PER_ORG = 4;

const JOKES = [
    "Oof. Looks like you need to read a little more.",
    "Well, maybe the news isn't as clear cut as I thought.",
    "Not bad. Just goes to show how weird the news is.",
    "Wow. The media is just as biased as they say everyone else is.",
    "Hmph. Lucky guess."
];

let headlines = [];
let loaded = 0;

let current = null;
let currentNum = 0;

let correct = 0;

$(document).ready(function() {
    collectHeadlines();

    $("#cnn").click(function() {
        submitResponse(0);
    });

    $("#fox").click(function() {
        submitResponse(1);
    });

    $("#times").click(function() {
        submitResponse(2);
    });

    $("#onion").click(function() {
        submitResponse(3);
    });

    $("#false").hide();
    $("#check").hide();
    $("#end").hide();

    $("#start").click(function() {
        $("#start").hide();
    });
});

function submitResponse(response) {
    console.log(response);

    if(current != null) {
        if(response == current[1]) {
            correct++;
            $("#check").show();
        } else {
            $("#false").show();
        }

        setTimeout(clearQuestion, 2000);
    }
}

function clearQuestion() {
    $("#headline").hide();
    $("#false").hide();
    $("#check").hide();

    setTimeout(nextQuestion, 50);
}

function nextQuestion() {
    currentNum++;

    if(currentNum < headlines.length) {
        current = headlines[currentNum];

        $("#headline").html(capitalizeWords(current[0]));
        $("#headline").show();
    } else {
        let percent = Math.round((correct / currentNum) * 100);
        end(percent);
    }

    $(".banner").html(currentNum + " / " + headlines.length);
}

function end(percent) {
    $("#percent").html(percent + "%");
    
    let i = Math.floor(percent / 25);
    $("#joke").html(JOKES[i]);

    $("#end").show();
}

function capitalizeWords(str)
{
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}
