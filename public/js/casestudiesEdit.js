$(document).ready(function () {

    var url = "/getCaseStudiesDetails";
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
                    $("#thumbImage").val(item);
                    $("#backImage1").html("<img data-dismiss='modal' width=100 height=60  src='" + item + "'/>");
                    $("#image1").val(item);
                }
                else if (i == "image2") {
                    $("#backImage2").html("<img data-dismiss='modal' width=100 height=60  src='" + item + "'/>");
                    $("#image2").val(item);
                }
                else if (i == "image3") {
                    $("#backImage3").html("<img data-dismiss='modal' width=100 height=60  src='" + item + "'/>");
                    $("#image3").val(item);
                }
                else if (i == "editor1") {
                    $("#editor1 .Editor-editor").html(item);
                }
                else if (i == "editor2") {
                    $("#editor2 .Editor-editor").html(item);
                }
                else if (i == "editor3") {
                    $("#editor3 .Editor-editor").html(item);
                }
                else if (i == "editor4") {
                    $("#editor4 .Editor-editor").html(item);
                }
                else if (i == "editor5") {
                    $("#editor5 .Editor-editor").html(item);
                }
                else if (i == "editor6") {
                    $("#editor6 .Editor-editor").html(item);
                }
                else if (i == "editor7") {
                    $("#editor7 .Editor-editor").html(item);
                }
                else if (i == "editor8") {
                    $("#editor8 .Editor-editor").html(item);
                }
                else if (i == "editor9") {
                    $("#editor9 .Editor-editor").html(item);
                }
                else if (i == "editor10") {
                    $("#editor10 .Editor-editor").html(item);
                }
                else {
                    $("#" + i).val(item);
                }

            }
        )
        ;
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


        var formDataAppend = "";
        formData = $(this).serialize();
        var editorText='';
        for (var i = 1; i < 11; i++) {
            formDataAppend += '&editor' + i + '=' + encodeURIComponent($('#editor' + i + ' .Editor-editor').html());
        }
        formData = formData + formDataAppend;
        console.log(formData);
        var url = "/editCaseStudies";
        var getCallback = function (response) {
            alert("Data edited successfully!");
            window.location = "/list-casestudies-admin";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });
    });
// form submit end
})
;// end ready
$(document).ready(function () {
    $("#txtEditor1").Editor();
    $("#txtEditor2").Editor();
    $("#txtEditor3").Editor();
    $("#txtEditor4").Editor();
    $("#txtEditor5").Editor();
    $("#txtEditor6").Editor();
    $("#txtEditor7").Editor();
    $("#txtEditor8").Editor();
    $("#txtEditor9").Editor();
    $("#txtEditor10").Editor();
});


var idName = "";
$(document).on("click", "#uploadImage1", function () {
    $("#InsertImage").modal("show");
    idName = "#backImage1";
    getImages();
});
$(document).on("click", "#uploadImage2", function () {
    $("#InsertImage").modal("show");
    idName = "#backImage2";
    getImages();
});
$(document).on("click", "#uploadImage3", function () {
    $("#InsertImage").modal("show");
    idName = "#backImage3";
    getImages();
});

$(document).on("click", "#editor1 .btn", function () {
    idName = "#editor1";
});
$(document).on("click", "#editor2 .btn", function () {
    idName = "#editor2";
});
$(document).on("click", "#editor3 .btn", function () {
    idName = "#editor3";
});
$(document).on("click", "#editor4 .btn", function () {
    idName = "#editor4";
});
$(document).on("click", "#editor5 .btn", function () {
    idName = "#editor5";
});
$(document).on("click", "#editor6 .btn", function () {
    idName = "#editor6";
});
$(document).on("click", "#editor7 .btn", function () {
    idName = "#editor7";
});
$(document).on("click", "#editor8 .btn", function () {
    idName = "#editor8";
});
$(document).on("click", "#editor9 .btn", function () {
    idName = "#editor9";
});
$(document).on("click", "#editor10 .btn", function () {
    idName = "#editor10";
});
$(document).on('click', '#InsertImage img', function () {
    if (idName == "#backImage1") {
        $("#image1").val($(this).attr('src'));
        $("#thumbImage").val($(this).attr('alt'));

        $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
    }
    else if (idName == "#backImage2") {
        $("#image2").val($(this).attr('src'));
        $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
    }
    else if (idName == "#backImage3") {
        $("#image3").val($(this).attr('src'));
        $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
    } else {
        $(idName + " .Editor-editor").append('<img src="' + $(this).attr('src') + '"/>');
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

function getImages() {
    $.get("/getBackgroundImages", function (response) {
        $("#InsertImage .modal-body").html("");
        $('#InsertImage .btn-success').css("display", "none");
        $("#InsertImage .modal-body").append("<button class='uploadBackgroundImages' class='btn btn-default'>Upload Files</button><div id='myId' class='dropzone'></div>");
        $("#InsertImage .modal-body").append("<div id='thumbwrap'/></div><div style='clear: both;'></div> ");
        $("#thumbwrap").html("");
        $.each(response, function (k, data) {
            $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=60  src='" + data.path + "'  alt='" + data.thumbPath + "'/>");


        });
    });
}