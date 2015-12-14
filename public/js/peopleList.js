/**
 * Created by chetan on 12/11/2015.
 */
$.get("/getPeopleList", function (data) {
    console.log(data);
    var tbl = $("<table/>").attr("id", "mytable");
    $("#div1").append(tbl);
    $("#mytable").append("<tbody>");
    for (var i = 0; i < data.length; i++) {
        var tr = "<tr>";
        var td1 = "<td>" + data[i]["people_order_1"] + "</td>";
        var td2 = "<td>" + data[i]["people_person_1_name"] + "</td>";
        var td3 = "<td>" + data[i]["people_person_1_position"] + "</td>";
        var IsPublished;
        if (data[i]["active"] == 'on') {
            IsPublished = " <i class='glyphicon glyphicon-ok'></i>"

        }
        else {
            IsPublished = " <i class='glyphicon glyphicon-remove'></i>"
        }
        var td4 = "<td>" + IsPublished + "</td>"
        var td5 = "<td><a href='edit-people-admin?id=" + data[i]["_id"] + "'>Edit Content</a> </td>"
        var trClose = "</tr></tbody>"

        $("#mytable").append(tr + td1 + td2 + td3 + td4 + td5 + trClose);

    }
    $("#mytable").append("</tbody>");

});

