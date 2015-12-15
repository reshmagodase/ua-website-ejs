/**
 * Created by chetan on 12/11/2015.
 */
$.get("/getBlogList", function (data) {
    var tbl = $("<table/>").attr("id", "mytable");
    $("#div1").append(tbl);
    $("#mytable").append("<tbody>");
    for (var i = 0; i < data.length; i++) {

        var td1 = "<tr><td>" + data[i]["title"] + "</td>";
        var IsPublished;
        if (data[i]["active"] == 'on') {
            IsPublished = " <i class='glyphicon glyphicon-ok'></i>"

        }
        else {
            IsPublished = " <i class='glyphicon glyphicon-remove'></i>"
        }
        var td2 = "<td>" + IsPublished + "</td>"
        var td3 = "<td>" + data[i]["publish_date_0"] + "</td>"
        var td4 = "<td><a href='edit-blog-admin?id=" + data[i]["_id"] + "'>Edit Content</a> </td></tr>"


        $("#mytable").append(td1 + td2 + td3 + td4);

    }
    $("#mytable").append("</tbody>");

});

