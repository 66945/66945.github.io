/**
 * Loads reviews from database
 * 
 * @param {String} teacherName The teacher to get reviews of
 */
function loadReviews(teacherName=null) {
    let http = new XMLHttpRequest();

    http.addEventListener('load', function() {
        let response = JSON.parse(this.responseText);
        console.log(response);

        let reviewsElement = document.getElementById('reviews');
        reviewsElement.innerHTML = '';
        for(let review of response) {
            let header = (teacherName === null ? review['teacherName'] + ' ' : '') + review['score'] + ' / 5';

            let reviewHTML = '<div class="review">' +
                             '<span>' + header + '</span><br>' +
                             '<div class="body">' + review['body'] + '</div></div>';
            
            reviewsElement.innerHTML += reviewHTML;
        }
    });

    if(teacherName !== null)
        http.open('GET', URL + '/reviews?q={"$and":[{"teacherName":"' + teacherName + '"},{"body":{"$not":""}}]}');
    else
        http.open('GET', URL + '/reviews?q={"body":{"$not":""}}');

    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Cache-Control', 'no-cache');
    http.setRequestHeader('x-apikey', RESTDB_API_KEY);
    http.send();
}