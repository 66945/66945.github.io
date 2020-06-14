const responses = [
    [["hi", "hello", "hey"], "Hi!"],
    [["you sure", "scam", "really", "u sure"], "Yup."],
    [["can you", "will you", "can u", "will u"], "Yes."],
    [["able to", "did you"], "No."],
    [["do you", "do u"], "Probably."],
    [["how are you", "how you", "how ya", "how u"], "I'm good, how are you?"],
    [["i'm doing", "i am doing", "im doing"], "That's good."],
    [["yet", "already"], "Not yet. Just hold on."],
    [["bad", "awful", "terrible"], "This looks pretty bad. Let me call my supervisor."],
    [["my name", "call me"], "Thats a nice name."],
    [["your name", "who are you", "who r u"], "My name is Kevin."],
    [["thanks", "thank you", "thnx"], "No problem."],
    [["help", "assist", "assistance"], "What can I help you with?"],
    [["refund"], "What do you need refunded?"],
    [["virus", "microsoft", "bt", "tech support"], "Be careful, that could be a scam. Make sure they don't mention gift cards."],
    [["i do"], "Just wait a moment."],
    [["bye", "see you", "see ya", "see u"], "Hope you have a great day!"]
];

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function updateScroll() {
    let msgs = document.getElementById("msgs");
    let scrollAmount = msgs.scrollHeight - window.scrollY;

    window.scrollBy(0, scrollAmount);

    setTimeout(updateScroll, 50);
}

function addMsg(side, text) {
    $("#msgs").append("<p class=\"" + side + "\">" + text + "</p>");
}

function respond(question) {
    question = question.toLowerCase();

    let answer = " ";

    for(let i = 0; i < responses.length; i++) {
        let hasText = false;

        for(let j = 0; j < responses[i][0].length; j++) {
            let response = responses[i][0][j];

            if(question.includes(response)) {
                if(!alphabet.includes(question.charAt(question.indexOf(response) + response.length))) {
                    if(!alphabet.includes(question.charAt(question.indexOf(response) - 1))) {
                        hasText = true;

                        question = question.replace(response, "");
                        break;
                    }
                }
            }
        }

        if(hasText) {
            answer += responses[i][1] + " ";
        }
    }

    if(answer !== " ") {
        addMsg("response", answer);
    }
}

updateScroll();

$("#newmsg").on("keypress", function(e) {
    if(e.which == 13) {
        let value = " " + $("#newmsg").val();
        if(!value.endsWith(".")) {
            value += " ";
        }

        addMsg("question", value);
        $("#newmsg").val("");

        setTimeout(respond, 1500, value);
    }
});