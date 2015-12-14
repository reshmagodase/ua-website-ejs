/**
 * Created by chetan on 12/11/2015.
 */
$.get("/getAuthorList", function (data) {
    console.log(data);
    var tbl = $("<table/>").attr("id", "mytable");
    $("#div1").append(tbl);
    $("#mytable").append( "<tbody>");
    for (var i = 0; i < data.length; i++) {

        var td1 = "<tr><td>" + data[i]["order_id"] + "</td>";
        var td2 = "<td>" + data[i]["first_name"] + "</td>";
        var td3 = "<td>" + data[i]["last_name"] + "</td>";
        var IsPublished;
        if (data[i]["active"] == 'on') {
            IsPublished = " <i class='glyphicon glyphicon-ok'></i>"

        }
        else {
            IsPublished = " <i class='glyphicon glyphicon-remove'></i>"
        }
        var td4 = "<td>" + IsPublished + "</td>"
        var td5 = "<td><a href='edit-author-admin?id=" + data[i]["_id"] + "'>Edit Content</a> </td></tr>"


        $("#mytable").append(td1 + td2 + td3 + td4 + td5);

    }
    $("#mytable").append("</tbody>");

});

