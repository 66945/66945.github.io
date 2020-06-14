const authQuestions = [
    ["What was the name of your first pet?", "Pet name", "Sally"],
    ["What is your date of birth?", "MM / DD / YYYY", "08 / 20 / 1943"],
    ["What is your anniversary date?", "MM / DD", "12 / 05"],
    ["What is your mothers maiden name?", "Last Name", "Floondis"],
    ["What is your favorite book?", "Book Title", "The secret adversary"],
    ["What is your daughters date of birth?", "MM / DD / YYYY", "11 / 31 / 1980"]
];

let unedited = $("#inspect").html();
let num = 0;

let frozen = false;

function freezeTest() {
    frozen = true;
}

function unfreezeTest() {
    frozen = false;
    unedited = $("#inspect").html();
    testEdit();
}

function testEdit() {
    if(!frozen && $("#inspect").html() != unedited) {
        $("#inspect").html(unedited);
        debugWarning();

        setTimeout(scamWarning, 2000);
    }

    if(!frozen) {
        setTimeout(testEdit, 100);
    }
}

function scamWarning() {
    num = Math.floor(Math.random() * authQuestions.length);

    $("#error").show();
    $("#question").html(authQuestions[num][0]);
    $("#answer").val("");
    $("#answer").attr("placeholder", authQuestions[num][1]);

    //let ans = prompt("Suspicious activity has been detected on this account.\n"
    //    + "Please answer the following question:\n" + authQuestions[num][0], authQuestions[num][1]);
    
    //if(ans !== authQuestions[num][2]) {
    //    alert("Two Factor Authentication failed. Incorrect response.");
    //    location.replace("index.html");
    //}
}

function reload() {
    location.replace("index.html");
}

$("#error").hide();
$("#errorMsg").hide();

$("#submit").click(function() {
    let ans = $("#answer").val();

    if(ans === authQuestions[num][2]) {
        $("#error").hide();
    } else {
        $("#errorMsg").show();
        setTimeout(reload, 1000);
    }
});

testEdit();