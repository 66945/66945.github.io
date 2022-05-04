const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const teacherName = urlParams.get('name');

let teacher;
let hasReviewed = document.cookie.includes('reviewed' + teacherName + '=true');

let reviewStars = 0;

/**
 * Gets teacher dict with appropriate name
 * 
 * @param {String} name
 * @param {Array<Object>} teachers
 * @returns Teacher dict or null if no teacher with name exists
 */
function getTeacher(name, teachers) {
    for(let teacher of teachers)
        if(teacher.name === name) return teacher;

    return null;
}

/**
 * Updates the teachers dictionary with new teacher data
 * 
 * @param {String} name The teachers name to set
 */
function setTeacher(name) {
    for(let i = 0; i < teachers.length; i++)
        if(teachers[i].name === name) teachers[i] = teacher;
}

/**
 * Sets the 5 star rating for the teacher
 * 
 * @param {Number} averageRating The teachers average rating
 * @param {Boolean} popup Where the stars are being set
 */
function setStars(averageRating, popup) {
    let el = popup ? 1 : 0;
    let stars = document.getElementsByClassName('star-form')[el].getElementsByTagName('img');

    for(let i = 0; i < stars.length; i++) {
        if(i < Math.round(averageRating))
            stars[i].classList.add('dark');
        else
            stars[i].classList.remove('dark');
    }
}

/**
 * Set bar to correct percentage
 * 
 * @param {HTMLElement} bar
 * @param {Number} percent
 */
function setBar(bar, percent) {
    bar.style = 'width: ' + (percent * 100).toFixed(0) + '%;';
}

/**
 * Updates the bars, score, and stars based on teacher data
 */
function updateScoreUI() {
    document.getElementById('score').innerHTML = averageRating(teacher).toFixed(1);
    let bars = document.getElementsByClassName('bar');

    let most = mostRatings(teacher);

    setBar(bars[0], teacher['5'] / most);
    setBar(bars[1], teacher['4'] / most);
    setBar(bars[2], teacher['3'] / most);
    setBar(bars[3], teacher['2'] / most);
    setBar(bars[4], teacher['1'] / most);

    setStars(averageRating(teacher), false);
}

/**
 * Shows or hides the review form popup
 * @param {Boolean} display Display visibility
 */
function toggleReview(display) {
    document.getElementById('popup').style = display && !hasReviewed ?
        'display:grid' :
        'display:none';
}

/**
 * Sets the review star number for the current session
 * 
 * @param {Number} starNum x out of 5 star review
 */
function setReviewStar(starNum) {
    reviewStars = starNum;
    setStars(starNum, true);
}

/**
 * Updates teacher score and submits text review
 */
function submitReview() {
    let reviewBody = document.getElementById('review').value;

    let http = new XMLHttpRequest();
    http.open('POST', URL + '/reviews');
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Cache-Control', 'no-cache');
    http.setRequestHeader('x-apikey', RESTDB_API_KEY);
    http.send(JSON.stringify({
        'teacherName': teacherName,
        'score': reviewStars,
        'body': reviewBody
    }));

    teacher[reviewStars.toString()] += 1;
    setTeacher(teacherName);
    updateStorage();

    updateScoreUI();

    document.cookie += 'reviewed' + teacherName + '=true;';
    hasReviewed = true;
    toggleReview(false);

    updateTeacherDatabase();
}

/**
 * Updates a teachers review numbers
 */
function updateTeacherDatabase() {
    let http = new XMLHttpRequest();
    http.open('PUT', URL + '/teachers/' + teacher._id);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Cache-Control', 'no-cache');
    http.setRequestHeader('x-apikey', RESTDB_API_KEY);
    http.send(JSON.stringify(teacher));
}

toggleReview(false);
document.getElementById('name').innerHTML = teacherName;
document.getElementById('popup-name').innerHTML = teacherName;

function onTeacherDataLoad() {
    teacher = getTeacher(teacherName, teachers);
    updateScoreUI();
}

loadTeacherData();
loadReviews(teacherName);