// This is f#@%ing awsome: https://rss2json.com/

const CNN   = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Frss.cnn.com%2Frss%2Fcnn_allpolitics.rss";
const FOX   = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.foxnews.com%2Ffoxnews%2Fpolitics";
const ONION = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpolitics.theonion.com%2Frss";

const TIMES_RE  = /title>(.*)</g; // For legacy NYT

const MAX_PER_ORG = 4;

const JOKES = [
    "Nice job Colton",
    "You guessed. Or you clicked the onion every single time. Very funny",
    "Not awful. Actually it is awful. In fact its the worst thing since 9/11. Great job!",
    "For once in your life you didn't fail",
    "Perfection"
];

const BUTTON_IDS = ["cnn", "fox", "onion"];

let headlinesRaw = {};
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

    $("#onion").click(function() {
        submitResponse(2);
    });

    $("#false").hide();
    $("#check").hide();
    $("#end").hide();

    $("#start").click(function() {
        $("#start").hide();
    });
});

function easyMode() {
    $("body").addClass("serious");
    $("#cnn").hide();
    $("#fox").html("fOX Nuws");
    $("#onion").html("Onoin");
    
    delete headlinesRaw[0];

    startGame();
}

function sovietMode() {
    $("body").addClass("soviet");
}

function startGame() {
    if(currentNum > 0) {
        correct = 0;

        $("#false").hide();
        $("#check").hide();
        $("#end").hide();

        $("#headline").show();
    } else {
        $(".loading").removeClass("loading");
    }

    currentNum = 0;
    shuffleHeadlines();

    current = headlines[currentNum];
    $("#headline").html(capitalizeWords(current[0]));
    
    $(".banner").html("0 / " + headlines.length);
}

function submitResponse(response) {
    if(current != null) {
        let correctID = current[1];

        if(response == correctID) {
            correct++;
            $("#check").show();
        } else {
            $("#false").show();

            setTimeout(flash, 600, BUTTON_IDS[correctID]);
        }

        setTimeout(clearQuestion, 2000);
    }
}

function flash(ID, bright=true) {
    if(bright) {
        $("#" + ID).addClass("flash");
        setTimeout(flash, 800, ID, false);
    } else {
        $("#" + ID).removeClass("flash");
    }
}

function clearQuestion() {
    $("#headline").hide();
    $("#false").hide();
    $("#check").hide();

    setTimeout(nextQuestion, 500);
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