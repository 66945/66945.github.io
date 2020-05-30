$(document).ready(function() {
    $("#errorMsg").hide();
    $("#login").click(function() {
        let password = $("#password").val();

        if(password.includes("password")) {
            location.replace("account.html");
        } else {
            $("#password").val("");
            $("#errorMsg").show();
        }
    });
});