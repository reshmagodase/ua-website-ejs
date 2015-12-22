/**
 * Created by chetan on 12/11/2015.
 */
$(document).ready(function () {
    $.get("/getAuthorList", function (response) {
        $.each(response, function (k, data) {
            $("#authorList").append("<label> <input type='checkbox' class='radio' value='" + data._id + "' name='author'/>" + data.first_name + "</label>");
        });
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: getCallback
        });
    });


    var url = "/getBlogDetails";
    var formData = '{"objectId":"' + getQueryStringValue("id") + '"}';


    var getCallback = function (response) {
        console.log(response);
        $.each(response, function (i, item) {
            if (i == "_id") {
                $("#objectId").val(item);
            }
            else if (i == "active") {
                $('#active').prop('checked', item);
            }
            else if (i == "editor1") {
                $(".Editor-editor").html(item);
            }
            else if (i == "image1") {
                $("#backImage1").html("<img data-dismiss='modal' width=100 height=60  src='" + item + "'/>");
                $("#image1").val(item);
                $("#thumbImage").val(item);
            }
            else if (i == "author") {
                $('input:checkbox').each(function () {
                    if ($(this).val() == item) {
                        $(this).attr('checked', true);
                    }
                });
                for (j = 0; j < item.length; j++) {
                    $('input:checkbox').each(function () {
                        if ($(this).val() == item[j]) {
                            $(this).attr('checked', true);
                        }
                    });
                }
            }
            else {
                $("#" + i).val(item);
            }

        });
    };


    function getQueryStringValue(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    $('form').submit(function (evt) {
        evt.preventDefault();
        formData = $(this).serialize();
        formData = formData + '&editor1=' + encodeURIComponent($('.Editor-editor').html());
        var url = "/editBlog";
        var getCallback = function (response) {
            alert("Data edited successfully!");
            window.location = "/list-blogs-admin";
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


$(document).on('click', '#InsertImage img', function () {
    if (idName == "#backImage1") {
        $("#image1").val($(this).attr('src'));
        $("#thumbImage").val($(this).attr('alt'));
        $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
    } else {
        $(".Editor-editor").append('<img src="' + $(this).attr('src') + '"/>');
    }
});


$(document).on("click", ".uploadBackgroundImages", function () {
    $("#myId").css("display", "block");
    var myDropzone = new Dropzone("div#myId", {
        url: "/uploadBackgroundImages",
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

