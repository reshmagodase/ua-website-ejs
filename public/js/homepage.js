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
                $("#image1").val(item);
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
            alert("Data edited successfully!");
            window.location = "/list-pages-admin";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });
    });// form submit end


});// end ready

$(document).ready(function () {
    $("#txtEditor").Editor();
});

var idName = "";
$(document).on("click", "#uploadImage1", function () {
    idName = "#backImage1";
    $.get("/getBackgroundImages", function (response) {
        $("#InsertImage .modal-body").html("");
        $("#InsertImage .modal-body").append("<button class='uploadFiles' class='btn btn-default'>Upload Files</button><div id='myId' class='dropzone'></div>");
        $("#InsertImage .modal-body").append("<div id='thumbwrap'/></div><div style='clear: both;'></div> ");
        $("#thumbwrap").html("");
        $.each(response, function (k, data) {
            $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=60  src='" + data.path + "'/>");

        });
    });
});


$(document).on('click', '#InsertImage img', function (e) {
    if (idName == "#backImage1") {
        $("#image1").val($(this).attr('src'));
        $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
    } else {
        $(".Editor-editor").append('<img width=500 height=300 src="' + $(this).attr('src') + '"/>');
    }
    e.stopImmediatePropagation();
});


$(document).on("click", ".uploadFiles", function () {
    $("#myId").css("display", "block");
    var myDropzone = new Dropzone("div#myId", {
        url: "/addBackgroundImages",
        dictDefaultMessage: "Click or Drop files here to upload",
        acceptedFiles: "image/jpeg,image/png,image/gif",
        maxFilesize: 1,
        maxFiles: 10,
        parallelUploads: 10,
        maxfilesexceeded: function (file) {
            alert('You have uploaded more than 1 Image. Only the first file will be uploaded!');
        },
        init: function () {

            // You might want to show the submit button only when
            // files are dropped here:
            this.on("addedfile", function () {
                // Show submit button here and/or inform user to click it.
            });
            this.on("success", function () {
                myDropzone.removeAllFiles();
                $.get("/getBackgroundImages", function (response) {
                    $("#thumbwrap").html("");
                    $.each(response, function (k, data) {
                        $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=60  src='" + data.path + "'/>");

                    });
                });
            })

        }
    });
});
