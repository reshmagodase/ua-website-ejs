$.get("/getCaseStudiesList", function (data) {
    console.log(data);
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
        var td2 = "<td>" + IsPublished + "</td>";
        var td3 = "<td><a href='edit-casestudy-admin?id=" + data[i]["_id"] + "'>Edit Content</a> </td>"
        var td4 = "<td><a href='case-studies/" + data[i]["slug"] + "/' target='_blank'>Preview</a> </td>"
        var trClose = "</tr>"

        $("#mytable").append(td1 + td2 + td3 + td4 + trClose);

    }
    $("#mytable").append("</tbody>");

});
