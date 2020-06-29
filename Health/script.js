$(document).ready(function() {
    $(".question > p").append(" <img src=\"/imgs/chevron.png\">");
    // $(".question > .answer").hide();
    $(this).find(".answer").addClass("closed");

    $(".question").click(function() {
        // $(this).find(".answer").toggle();

        console.log($(this).find("p img").css("transform"));
        if($(this).find("p img").css("transform") == "matrix(1, 0, 0, 1, 0, 0)") {
            $(this).find("p img").css("transform", "scaleY(-1)");
            $(this).find(".answer").removeClass("closed");
        } else {
            $(this).find("p img").css("transform", "scaleY(1)");
            $(this).find(".answer").addClass("closed");
        }
    });
});