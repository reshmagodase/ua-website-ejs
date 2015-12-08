$(document).ready(function () {
//Get Home page Data

    $.get("/getHomepageText", function (data) {
        console.log(data);
        $.each(data, function (i, item) {
            if (i == "_id") {
                $("#objectId").val(item);
            }
            else if(i=="image1"){
                $("#backImage1").html("<img data-dismiss='modal' width=100 height=60  src='" + item + "'/>");
            }
            else {
                $("#" + i).val(item);
            }

        });

    });


//Upload Home page Data
    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = $(this).serialize();
        var url = "/homepageText";
        var getCallback = function (response) {
            $("#successMsg").html("<div class='alert alert-info'>Data updated successfully!</div>")
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });
    });// form submit end


});// end ready