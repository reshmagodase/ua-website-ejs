/**
 * Created by chetan on 12/11/2015.
 */
$(document).ready(function () {
    $("#txtEditor").Editor();
});

var idName = "";
$(document).on("click", "#uploadImage1", function () {
    idName = "#backImage1";
    $("#InsertImage").modal("show");
    $.get("/getBackgroundImages", function (response) {
        $("#InsertImage .modal-body").html("");
        $("#InsertImage .modal-body").append("<button class='uploadBackgroundImages' class='btn btn-default'>Upload Files</button><div id='myId' class='dropzone'></div>");
        $("#InsertImage .modal-body").append("<div id='thumbwrap'/></div><div style='clear: both;'></div> ");
        $("#thumbwrap").html("");
        $.each(response, function (k, data) {
            $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=60  src='" + data.path + "'  alt='" + data.thumbPath + "'/>");
        });
    });
});


$(document).on('click', '#InsertImage img', function (e) {
    if (idName == "#backImage1") {
        $("#image1").val($(this).attr('src'));
        $("#thumbImage").val($(this).attr('alt'));
        $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
    } else {
        $(".Editor-editor").append('<img width=500 height=300 src="' + $(this).attr('src') + '"/>');
    }
    e.stopImmediatePropagation();
});


$(document).on("click", ".uploadBackgroundImages", function () {
    $("#myId").css("display", "block");
    var myDropzone = new Dropzone("div#myId", {
        url: "/uploadBackgroundImages",
        dictDefaultMessage: "Click or Drop files here to upload",
        acceptedFiles: "image/jpeg,image/png,image/gif",
        parallelUploads: 10,
        maxFilesize: 1,

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
                        $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=60  src='" + data.path + "'  alt='" + data.thumbPath + "'/>");
                    });
                });
            })

        }
    });
});
$.get("/getAuthorList", function (response) {
    $.each(response, function (k, data) {
        $("#authorList").append("<label> <input type='checkbox' class='radio' value='"+ data._id +"' name='author'/>"+ data.first_name +"</label>");
    });
});
