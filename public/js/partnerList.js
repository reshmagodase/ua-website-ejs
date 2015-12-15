/**
 * Created by chetan on 12/11/2015.
 */
$.get("/getPartnersList", function (data) {
    console.log(data);
    var tbl = $("<table/>").attr("id", "mytable");
    $("#div1").append(tbl);
    $("#mytable").append("<tbody>");

    for (var i = 0; i < data.length; i++) {
        var tr = "<tr>";
        var td1 = "<td>" + data[i]["partner_name"] + "</td>";
        var IsPublished;
        if (data[i]["active"] == 'on') {
            IsPublished = " <i class='glyphicon glyphicon-ok'></i>"

        }
        else {
            IsPublished = " <i class='glyphicon glyphicon-remove'></i>"
        }
        var td2 = "<td>" + IsPublished + "</td>";
        var td3 = "<td><a href='" + data[i]["link"] + "' target='_blank'>" + data[i]["link"] + "</a></td>";

        var td4 = "<td><a href='edit-partner-admin?id=" + data[i]["_id"] + "'>Edit Content</a> </td>"
        var trClose = "</tr></tbody>"

        $("#mytable").append(tr + td1 + td2 + td3 + td4 + trClose);

    }
    $("#mytable").append("</tbody>");
});

