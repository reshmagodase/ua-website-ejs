/**
 * Created by chetan on 12/17/2015.
 */



$(document).ready(function(){

    $("#authUser").click(function(){

        authenticate();


    });
});


function authenticate() {


    // Setting Up Login Call
    var username = $("#username").val();
    var password = $("#password").val();
    var loginJSONdata = '{"username":"'+ username+ '","password":"' + password +'"}';
    var loginURL = "/login";



    // Login Call Back
    var loginResponseCallback = function(response){

        if(response.status==="success")
        {
            window.location.href = "/list-blogs-admin";
        }
        else{
            $('#error').html('<p class="errornote alert alert-danger"> Please enter the correct username and password. Note that both fields may be case-sensitive. </p>')
        }

    };

    $.ajax({
        url:loginURL,
        type:"POST",
        data:loginJSONdata,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success:loginResponseCallback
    });


}// end of authenticate

