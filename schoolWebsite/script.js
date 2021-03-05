window.onscroll = function() {scrolled()};

let navbar = document.getElementById("navbar");

function scrolled() {
    let stickpos = window.innerHeight;

    if (window.pageYOffset >= stickpos) {
        navbar.classList.add("scrolled");
        navbar.classList.remove("unscrolled");
    } else {
        navbar.classList.remove("scrolled");
        navbar.classList.add("unscrolled");
    }
}

// $.get("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffch.psdschools.org%2Frss.xml", function(response) {
//     console.log(response);
    
//     for (let i = 0; i < response["items"].length && i < 4; i++) {
//         $("#news").append("<a href=\"" + response["items"][i]["link"] + "\">" + response["items"][i]["title"] + "</a><br><br>");
//     }
// });