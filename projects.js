const DESC_LENGTH = 10;

let http = new XMLHttpRequest();
http.onload = loadProjects;
http.open('GET', 'https://api.github.com/users/66945/repos');
http.setRequestHeader('Authorization', 'token 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');
http.send();

let slide = 0;
setSlide(slide);
// setTimeout(updateSlide, 5000);

function loadProjects() {
    console.log(this.response);
    data = JSON.parse(this.response);

    for(let project in data) {
        let name = data[project]['name'];
        let description = data[project]['description'];
        let language = data[project]['language'];
        let url = data[project]['html_url'];

        // name = name.toUpperCase();

        let projects = document.getElementById('project-cards');

        if(description != null) {
            // cuts descriptions that are longer than DESC_LENGTH words
            description = cutDescription(description);

            projects.innerHTML += '<div>' +
                                '<h1>' + name + '</h1>' +
                                '<span class="tech">' + language + '</span>' +
                                '<br>' +
                                description +
                                '<br>' +
                                '<a href="' + url + '" target="_blank">Github</a>' +
                                '</div>';
        }
    }
}

function cutDescription(desc, len=DESC_LENGTH) {
    descriptionArr = desc.split(' ');
    if(descriptionArr.length > len) {
        let description = '';

        for(let i = 0; i < len; i++) {
            description += descriptionArr[i] + ' ';
        }

        description += '. . .';

        return description;
    } else {
        return desc;
    }
}

function setSlide(slideNum) {
    let slides = document.getElementsByClassName('slide-img');
    slideNum = slideNum % slides.length;

    for(let i = 0; i < slides.length; i++) {
        if(i === slideNum)
            slides[i].style.display = 'block';
        else
            slides[i].style.display = 'none';
    }

    let text = document.getElementById('slide-num');
    text.innerHTML = (slideNum + 1) +' / ' + slides.length;
}

function updateSlide() {
    slide++;
    setSlide(slide);
    setTimeout(updateSlide, 5000);
}

function prev() {
    slide--;
    if(slide < 0) { slide = 2; }
    
    setSlide(slide);
}

function next() {
    slide++;
    setSlide(slide);
}