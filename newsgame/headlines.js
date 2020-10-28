function collectHeadlines() {
    $.get(CNN, function(response) {
        let items = response["items"];
        console.log(response["items"]);

        for(let i = 0; i < items.length && i < MAX_PER_ORG; i++) {
            headlines.push([items[i]["title"], 0]);
            // console.log(items[i]["title"]);
        }

        setupGame();
    });

    $.get(FOX, function(response) {
        let items = response["items"];
        console.log(response["items"]);

        for(let i = 0; i < items.length && i < MAX_PER_ORG; i++) {
            headlines.push([items[i]["title"], 1]);
            // console.log(items[i]["title"]);
        }

        setupGame();
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

    $.get(ONION, function(response) {
        let items = response["items"];
        console.log(response["items"]);

        for(let i = 0; i < items.length && i < MAX_PER_ORG; i++) {
            headlines.push([items[i]["title"], 3]);
            // console.log(items[i]["title"]);
        }

        setupGame();
    });
}

function collectHeadlinesTest() {
    headlines = [
        ["Trump cancels Republican convention activities in Jacksonville", 0],
        ["Trump says he could send as many as 75,000 federal agents to US cities", 0],
        ["Fact check: Trump continues to dishonestly downplay the pandemic", 0],
        ["Colorado 2020 Senate race: What to know about the Gardner-Hickenlooper contest", 1],
        ["Nancy Pelosi Calls Jamaal Bowman To Scold Him For Winning Primary", 2],
        // ["Barack Obama and Joe Biden Join Forces in Video Targeting Trump", 3],
        ["CDC rolls out tools for schools to reopen safely during coronavirus outbreak: 'Critically important'", 1],
        // ["A.O.C. Unleashes a Viral Condemnation of Sexism in Congress", 3],
        ["Kansas City mayor: 'Doxing' of police, officials should be criminalized", 1],
        ["Self-Loathing GOP Congressman Can’t Believe He’s Been Reduced To Defending Necessity Of Public Schools", 2],
        ["Timeline Of Presidential Polling", 2]
        // ["Bloomberg's Everytown for Gun Safety Pours $15 Million Into Races in 8 States", 3]
    ];

    loaded = 3;
    setupGame();
}

function shuffleHeadlines() {
    for(let i = headlines.length - 1; i > 0; i--) {
        let rand = Math.floor(Math.random() * (i + 1));

        let t = headlines[i];
        headlines[i] = headlines[rand];
        headlines[rand] = t;
    }
}

function setupGame() {
    loaded++;
    
    if(loaded == 3) {
        startGame();
    }
}

function startGame() {
    if(currentNum > 0) {
        correct = 0;

        $("#false").hide();
        $("#check").hide();
        $("#end").hide();

        $("#headline").show();
    }

    currentNum = 0;
    shuffleHeadlines();

    current = headlines[currentNum];
    $("#headline").html(capitalizeWords(current[0]));
    
    $(".banner").html("0 / " + headlines.length);
}