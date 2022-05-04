const RESTDB_API_KEY = '622bc1bedced170e8c83a149';
const URL = 'https://mainpage-cee9.restdb.io/rest/';

let teachers = [];

/**
 * Loads teacher data from database
 */
function loadTeacherData() {
    if(checkLocalStorage()) return;

    let http = new XMLHttpRequest();

    http.addEventListener('load', function() {
        let response = JSON.parse(this.responseText);

        for(let item of response)
            teachers.push(item);

        teachers = sortTeachers(teachers);
        updateStorage();

        console.log(teachers);
        onTeacherDataLoad();
    });

    http.open('GET', URL + '/teachers');
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Cache-Control', 'no-cache');
    http.setRequestHeader('x-apikey', RESTDB_API_KEY);
    http.send();
}

/**
 * Updates local storage for faster loading times
 */
function updateStorage() {
    teachers = sortTeachers(teachers);
    sessionStorage.setItem('teachers', JSON.stringify(teachers));
}

/**
 * Loads teacher data from local storage if it exists
 * 
 * @returns Whether or not the teachers data is saved to local storage
 */
function checkLocalStorage() {
    if(sessionStorage.getItem('teachers') !== null) {
        teachers = JSON.parse(sessionStorage.getItem('teachers'));
        onTeacherDataLoad();
        return true;
    }

    return false;
}

/**
 * Gets average star rating for teacher
 * 
 * @param {Object} teacher 
 * @returns The average rating
 */
function averageRating(teacher) {
    let stars = 0;
    stars += teacher['5'] * 5;
    stars += teacher['4'] * 4;
    stars += teacher['3'] * 3;
    stars += teacher['2'] * 2;
    stars += teacher['1'] * 1;
    
    let sum = teacher['5'] + teacher['4'] + teacher['3'] + teacher['2'] + teacher['1'];

    return stars / sum;
}

/**
 * Gets the highest number of star ratings a teacher has
 * 
 * @param {Object} teacher 
 * @returns The highest number of star ratings a teacher has
 */
function mostRatings(teacher) {
    let highest = 1;
    for(let i = 5; i > 0; i--) {
        if(teacher[i.toString()] > highest)
            highest = teacher[i.toString()];
    }

    return highest;
}

/**
 * Sorts teachers by ranking
 * 
 * @param {Object} teachers 
 * @returns Sorted array of teacher dicts by ranking
 */
function sortTeachers(teachers) {
    teachers = JSON.parse(JSON.stringify(teachers));
    teachers.sort(function(first, second) {
        let fRating = averageRating(first);
        let sRating = averageRating(second);

        if(Number.isNaN(fRating)) { return 1; }
        if(Number.isNaN(sRating)) { return -1; }

        return sRating - fRating;
    });

    return teachers;
}

/**
 * Adds row with teacher data to ranking table
 * 
 * @param {HTMLElement} table 
 * @param {Object} teacher 
 * @param {Number} rank 
 */
function addRow(table, teacher, rank) {
    let row = table.insertRow(-1);
    let rankCell = row.insertCell(0);
    let nameCell = row.insertCell(1);
    let rateCell = row.insertCell(2);

    let rating = averageRating(teacher);
    let rated = !Number.isNaN(rating);

    let teacherLink = '<a href="teacher.html?name=' + teacher.name + '">' + teacher.name + '</a>'

    rankCell.innerHTML = rank;
    nameCell.innerHTML = rated ? teacherLink : '<span class="unrated">' + teacherLink + '</span>';
    rateCell.innerHTML = rated ? rating.toFixed(1) : 'N/A';
}