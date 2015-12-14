/**
 * Created by chetan on 12/11/2015.
 */
$(document).ready(function () {

    var url = "/getPeopleDetails";
    var formData = '{"objectId":"' + getQueryStringValue("id") + '"}';

    console.log(formData);

    var getCallback = function (response) {
        console.log(response);
        $.each(response, function (i, item) {
            if (i == "_id") {
                $("#objectId").val(item);
            }
            else if (i == "active") {
                $('#active').prop('checked', item);
            }
            else if (i == "image1") {
                $("#backImage1").html("<img data-dismiss='modal' width=100 height=100  src='" + item + "'/>");
                $("#image1").val(item);
            }
            else {
                $("#" + i).val(item);
            }

        });
    };
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: getCallback
    });

    function getQueryStringValue(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    $('form').submit(function (evt) {
        evt.preventDefault();
        formData = $(this).serialize();
        var url = "/editPeople";
        var getCallback = function (response) {
            alert("Data edited successfully!");
            window.location = "/list-people-admin";
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
    $("#InsertImage").modal("show");
    idName = "#backImage1";
    $.get("/getImages", function (response) {
        $("#InsertImage .modal-body").html("");
        $("#InsertImage .modal-body").append("<button class='uploadPeopleImages' class='btn btn-default'>Upload Files</button><div id='myId' class='dropzone'></div>");
        $("#InsertImage .modal-body").append("<div id='thumbwrap'/></div><div style='clear: both;'></div> ");
        $("#thumbwrap").html("");
        $.each(response, function (k, data) {
            $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=100  src='" + data.path + "'/>");

        });
    });
});


$(document).on('click', '#InsertImage img', function (e) {
    if (idName == "#backImage1") {
        $("#image1").val($(this).attr('src'));
        $(idName).html('<img width=100 height=100 src="' + $(this).attr('src') + '"/>');
    } else {
        $(".Editor-editor").append('<img width=500 height=300 src="' + $(this).attr('src') + '"/>');
    }
    e.stopImmediatePropagation();
});


$(document).on("click", ".uploadPeopleImages", function () {
    $("#myId").css("display", "block");
    var myDropzone = new Dropzone("div#myId", {
        url: "/uploadPeopleImages",
        dictDefaultMessage: "Click or Drop files here to upload",
        acceptedFiles: "image/jpeg,image/png,image/gif",
        maxFilesize: 1,
        parallelUploads: 10,

        init: function () {

            // You might want to show the submit button only when
            // files are dropped here:
            this.on("addedfile", function () {
                // Show submit button here and/or inform user to click it.
            });
            this.on("success", function () {
                myDropzone.removeAllFiles();
                $.get("/getPeopleImages", function (response) {
                    $("#thumbwrap").html("");
                    $.each(response, function (k, data) {
                        $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=100  src='" + data.path + "'/>");

                    });
                });
            })

        }
    });
});
