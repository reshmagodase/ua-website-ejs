$.get("/getDefaultList", function (data) {
    console.log(data);
    var tbl = $("<table/>").attr("id", "mytable");
    $("#div1").append(tbl);
    var tr1 = "<tbody><tr><td>Home</td><td><a href='home-admin'>Edit Content</a></td><td></td></tr>";
    var tr2 = "<tr><td>About</td><td><a href='about-admin'>Edit Content</a></td><td></td></tr>";
    $("#mytable").append(tr1 + tr2);
    for (var i = 0; i < data.length; i++) {
        var td1 = "<tr><td>" + data[i]["title"] + "</td>";
        var td2 = "<td><a href='default-admin?id=" + data[i]["_id"] + "'>Edit Content</a> </td>"
        var td3 = "<td></td></tr>"
        $("#mytable").append(td1 + td2 + td3);
    }
    $("#mytable").append("</tbody>");
});
