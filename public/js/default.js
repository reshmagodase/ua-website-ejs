/**
 * Created by chetan on 12/11/2015.
 */
var str = 'default';
$(document).ready(function () {
    $("#txtEditor").Editor();
    $(document).on('click', '#InsertImage img', function () {
        if(str=='default'){
            $(".Editor-editor").append('<img width=500 height=300 src="' + $(this).attr('src') + '"/>');
        }
    });

    var url = "/getDefaultDetails";
    var formData = '{"objectId":"' + getQueryStringValue("id") + '"}';

    console.log(formData);

    var getCallback = function (response) {
        console.log(response);
        $.each(response, function (i, item) {
            if (i == "_id") {
                $("#objectId").val(item);
            }
            else if (i == "editor") {
                $(".Editor-editor").html(item);
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
        formData = formData + '&editor=' + encodeURIComponent($('.Editor-editor').html());
        ;
        var url = "/editDefault";
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
