online = true;

let images;
let activeImage = 0;
let loaded = [];

let error = true;

$(document).ready(function() {
    if(!error) {
        for(let i in imgIds) {
            $('.images').append('<img src="' + imgIds[i] + '" alt="image not available">');
        }

        images = $(".images img");
        changeImage(0);

        $('#lBtn').click(function() { changeImage(activeImage - 1); });
        $('#rBtn').click(function() { changeImage(activeImage + 1); });

        $('.infoBack').hide();
        $('#info').click(function() { $('.infoBack').show(); });
        $('.infoBack').click(function() { $('.infoBack').hide(); });

        setTimeout(finishLoading, (Math.random() * 2000) + 2000);
    } else {
        setTimeout(showError, (Math.random() * 2000) + 6000);
    }
});

function finishLoading() {
    $('.loadingPane').fadeOut();
}

function showError() {
    let d = new Date();
    let date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + (d.getYear() + 1900);
    $('.error').html('<b>Sorry!</b> Unfortunately OneDrive ImageView is down for maintanence between <b>12:00 AM ' + date + '</b> and <b>11:59 PM ' + date + '</b>. Thank you for understanding!');
    $('.loadingPane .loader').hide();
    $('.error').show();
}

function changeImage(newImage) {
    if(newImage < images.length && newImage >= 0) {
        for(let i = 0; i < images.length; i++) {
            $(images[i]).hide();
        }

        activeImage = newImage;

        if(loaded.includes(activeImage)) {
            $(images[activeImage]).show();
        } else {
            $("#imgLoad").show();
            setTimeout(loadImage, (Math.random() * 500) + 100);
        }
        
        $('#lBtn').show(); $('#rBtn').show();
        if(activeImage == 0) { $('#lBtn').hide(); }
        if(activeImage == images.length - 1) { $('#rBtn').hide(); }
    }
}

function loadImage() {
    $("#imgLoad").hide();
    $(images[activeImage]).show();
    loaded.push(activeImage);
}
