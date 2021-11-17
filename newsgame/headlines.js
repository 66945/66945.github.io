function collectHeadlines() {
    $.get(CNN, function(response) {
        processResponse(response, 0)
    });
    $.get(FOX, function(response) {
        processResponse(response, 1)
    });
    $.get(ONION, function(response) {
        processResponse(response, 2)
    });

    // $.get(TIMES, function(response) {
    //     let xml = new XMLSerializer().serializeToString(response);
    //     // console.log(xml);

    //     let timesArr = [...xml.matchAll(TIMES_RE)];

    //     for(let i = 2; i < timesArr.length && i-2 < MAX_PER_ORG; i++) {
    //         headlines.push([timesArr[i][1], 3]);
    //         console.log(timesArr[i][1]);
    //     }

    //     setupGame();
    // });
}

function processResponse(response, num) {
    let items = response["items"];
    console.log(response["items"]);

    headlinesRaw[num] = [];

    for(let item of items) {
        headlinesRaw[num].push(item["title"]);
        // console.log(items[i]["title"]);
    }

    setupGame();
}

function collectHeadlinesTest() {
    headlinesRaw = {
        0: [
            "Trump cancels Republican convention activities in Jacksonville",
            "Trump says he could send as many as 75,000 federal agents to US cities",
            "Fact check: Trump continues to dishonestly downplay the pandemic"
        ],
        1: [
            "Colorado 2020 Senate race: What to know about the Gardner-Hickenlooper contest",
        // ["Barack Obama and Joe Biden Join Forces in Video Targeting Trump", 3],
            "CDC rolls out tools for schools to reopen safely during coronavirus outbreak: 'Critically important'",
        // ["A.O.C. Unleashes a Viral Condemnation of Sexism in Congress", 3],
            "Kansas City mayor: 'Doxing' of police, officials should be criminalized"
        ],
        2: [
            "Nancy Pelosi Calls Jamaal Bowman To Scold Him For Winning Primary",
            "Self-Loathing GOP Congressman Can’t Believe He’s Been Reduced To Defending Necessity Of Public Schools",
            "Timeline Of Presidential Polling"
        ]
        // ["Bloomberg's Everytown for Gun Safety Pours $15 Million Into Races in 8 States", 3]
    };

    loaded = 2;
    setupGame();
}

function shuffleHeadlines() {
    headlines = [];

    for(let key of Object.keys(headlinesRaw)) {
        let shuffled = shuffleArray(headlinesRaw[key]);
        for(let i = 0; i < MAX_PER_ORG && i < shuffled.length; i++) {
            headlines.push([shuffled[i], key]);
        }
    }

    headlines = shuffleArray(headlines);
}

function shuffleArray(array) {
    let shuffled = [...array];

    for(let i = shuffled.length - 1; i > 0; i--) {
        let index = Math.floor(Math.random() * i);
        
        [shuffled[i], shuffled[index]] = [shuffled[index], shuffled[i]];
    }

    return shuffled;
}

function setupGame() {
    loaded++;
    
    if(loaded == 3) {
        startGame();
    }
}

function capitalizeWords(str)
{
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}