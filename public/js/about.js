$(document).ready(function () {
    $("#txtEditor1").Editor();
    $("#txtEditor2").Editor();
    $("#txtEditor3").Editor();
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
            $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=60  src='" + data.path + "'/>");

        });
    });
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
$(document).on('click', '#InsertImage img', function (e) {
    if (idName == "#backImage1") {
        $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
        $("#image1").val($(this).attr('src'));
        idName="";
    } else {
        $(idName + " .Editor-editor").append('<img width=500 height=300 src="' + $(this).attr('src') + '"/>');
        idName="";
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
                        $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=60  src='" + data.path + "'/>");

                    });
                });
            })

        }
    });
});

$.get("/getPeopleList", function (response) {
    $.each(response, function (k, data) {
        $("#peopleList").append("<label> <input type='checkbox' class='radio' value='" + data._id + "' name='people'/>" + data.people_person_1_name + "</label>");
    });
});


//Get About page Data

$.get("/getAboutDetails", function (data) {
    console.log(data);
    $.each(data, function (i, item) {
        if (i == "_id") {
            $("#objectId").val(item);
        }
        else if (i == "image1") {
            $("#backImage1").html("<img data-dismiss='modal' width=100 height=60  src='" + item + "'/>");
            $("#image1").val(item);
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
        else if (i == "people") {
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

});


$('form').submit(function (evt) {
    evt.preventDefault();


    var formDataAppend = "";
    formData = $(this).serialize();
    for (var i = 1; i < 4; i++) {
        formDataAppend += '&editor' + i + '=' + encodeURIComponent($('#editor' + i + ' .Editor-editor').html());
    }
    formData = formData + formDataAppend;
    console.log(formData);
    var url = "/editAbout";
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
});

