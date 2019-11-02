//============================================================//
//                                                            //
//              These are the actual projects                 //
//              They are stored in the format:                //
//[[name, description, [links]], [name, description, link]]//
//                                                            //
//============================================================//
const projects = [
    [
        "Vector Translate",
        ["a program I created that allows you to transform equations and polygons automatically."],
        "vec.html"
    ],
    [
        "The Texting Robot",
        [
            "a robot we are working on that allows you to send a text to the robot, and it will print it out on a peice of paper.",
            "If you want to help with the Robot, here are the github repositories for the code and 3D models"
        ],
        "https://github.com/66945/TextingRobot"
    ],
    [
        "Renshaw",
        [
            "a quick script you can put in a chrome bookmark to re-enable styling on <a href=\"https://jrenshaw.com\" class=\"link\">Jonathon Renshaws website.</a>",
            "To download just paste the code given into a bookmark and click it whenever the website becomes ugly"
        ],
        "renshaw.html"
    ]
];

//============================================================//
//                                                            //
//          The actual code for loading the projects          //
//                                                            //
//============================================================//
let projectDiv = document.getElementById("projects");

function addProject(project) {
    projectDiv.innerHTML += "<h2>" + project[0] + "</h2>";
    projectDiv.innerHTML += "<i>" + project[0] + "</i> is ";
    
    for(let i = 0; i < project[1].length; i++) {
        projectDiv.innerHTML += project[1][i];
        projectDiv.innerHTML += "<br>";
    }
    projectDiv.innerHTML += "<br>";

    projectDiv.innerHTML += "<a href=\"" + project[2] + "\" class=\"link\">" + project[0] + "</a>";
    projectDiv.innerHTML += "<br><br>";
}

function loadProjects() {
    for(let i = 0; i < projects.length; i++) {
        addProject(projects[i]);
    }
}