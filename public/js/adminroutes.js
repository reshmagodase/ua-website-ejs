'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'ngSanitize',
    'ngStorage'
]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
        .when('/admin/', {
            templateUrl: 'viewsAdmin/admin.html',
            controller: 'LoginCtrl'
        })
        .when('/admin/home/', {
            templateUrl: 'viewsAdmin/home.html',
            controller: 'HomeCtrl'
        })
        .when('/admin/casestudylist/', {
            templateUrl: 'viewsAdmin/casestudylist.html',
            controller: 'CaseStudyListCtrl'
        })
        .when('/admin/advisoryboard/', {
            templateUrl: 'viewsAdmin/advisoryboard.html',
            controller: 'ABCtrl'
        })
        .when('/admin/casestudy/', {
            templateUrl: 'viewsAdmin/casestudy.html',
            controller: 'CaseStudyAddCtrl'
        })
        .when('/admin/partnerlist/', {
            templateUrl: 'viewsAdmin/partnerlist.html',
            controller: 'PartnerListCtrl'
        })
        .when('/admin/partner/', {
            templateUrl: 'viewsAdmin/partner.html',
            controller: 'PartnerAddCtrl'
        })
        .when('/admin/bloglist/', {
            templateUrl: 'viewsAdmin/bloglist.html',
            controller: 'BlogListCtrl'
        })
        .when('/admin/newslist/', {
            templateUrl: 'viewsAdmin/newslist.html',
            controller: 'NewsListCtrl'
        })
        .when('/admin/news/', {
            templateUrl: 'viewsAdmin/news.html'
        })
        .when('/admin/blog/', {
            templateUrl: 'viewsAdmin/blog.html',
            controller: 'BlogAddCtrl'
        })
        .when('/admin/authorlist/', {
            templateUrl: 'viewsAdmin/authorlist.html',
            controller: 'AuthorListCtrl'
        })
        .when('/admin/author/', {
            templateUrl: 'viewsAdmin/author.html',
            controller: 'AuthorAddCtrl'
        })
        .when('/admin/fps/', {
            templateUrl: 'viewsAdmin/fps.html',
            controller: 'fpsCtrl'
        })
        .when('/admin/whyua/', {
            templateUrl: 'viewsAdmin/whyua.html',
            controller: 'whyuaCtrl'
        })
        .when('/admin/mts/', {
            templateUrl: 'viewsAdmin/mts.html',
            controller: 'mtsCtrl'
        })
        .when('/admin/bes/', {
            templateUrl: 'viewsAdmin/bes.html',
            controller: 'besCtrl'
        })
        .when('/admin/bus/', {
            templateUrl: 'viewsAdmin/bus.html',
            controller: 'busCtrl'
        })
        .when('/admin/pms/', {
            templateUrl: 'viewsAdmin/pms.html',
            controller: 'pmsCtrl'
        })
        .when('/admin/faq/', {
            templateUrl: 'viewsAdmin/faq.html',
            controller: 'faqCtrl'
        })
        .when('/admin/contactlist/', {
            templateUrl: 'viewsAdmin/contactlist.html',
            controller: 'ContactListCtrl'
        })
        .when('/admin/contact/', {
            templateUrl: 'viewsAdmin/contact.html',
            controller: 'ContactAddCtrl'
        })
        .when('/admin/productlist/', {
            templateUrl: 'viewsAdmin/productlist.html',
            controller: 'ProductListCtrl'
        })
        .when('/admin/product/', {
            templateUrl: 'viewsAdmin/product.html',
            controller: 'ProductCtrl'
        })
        .when('/admin/campaign/', {
            templateUrl: 'viewsAdmin/churchcampaign.html',
            controller: 'campaignCtrl'
        })
        .when('/admin/loa/', {
            templateUrl: 'viewsAdmin/loa.html',
            controller: 'loaCtrl'
        })
        .when('/admin/testimonials/', {
            templateUrl: 'viewsAdmin/testimonials.html',
            controller: 'testimonialsCtrl'
        })
        .when('/admin/addtestimonial/', {
            templateUrl: 'viewsAdmin/addtestimonial.html',
            controller: 'testimonialsCtrl'
        })
        .when('/admin/contactdata/', {
            templateUrl: 'viewsAdmin/contactdata.html',
            controller: 'ContactdataCtrl'
        })
        .when('/admin/invoicevalidation/', {
            templateUrl: 'viewsAdmin/invoicevalidation.html',
            controller: 'invoicevalidationCtrl'
        })
        .when('/admin/netzero/', {
            templateUrl: 'viewsAdmin/netZero.html',
            controller: 'netZeroCtrl'
        })
        .when('/admin/voidmanagement/', {
            templateUrl: 'viewsAdmin/voidmanagement.html',
            controller: 'voidmanagementCtrl'
        })
        .when('/admin/customercare/', {
            templateUrl: 'viewsAdmin/customercare.html',
            controller: 'customercareCtrl'
        })
        .when('/admin/accountmanagement/', {
            templateUrl: 'viewsAdmin/accountmanagement.html',
            controller: 'accountmanagementCtrl'
        })
        .when('/admin/teamlist/', {
            templateUrl: 'viewsAdmin/teamList.html',
            controller: 'TeamListCtrl'
        })
        .when('/admin/team/', {
            templateUrl: 'viewsAdmin/team.html'
        })
        .when('/admin/ourheritage/', {
            templateUrl: 'viewsAdmin/ourHeritage.html',
            controller: 'ourHeritageCtrl'
        })
        .when('/admin/national-charity/', {
            templateUrl: 'viewsAdmin/national_charity.html',
            controller: 'nationalCharityCtrl'
        })
        .otherwise({
            redirectTo: '/admin/'
        });
});
app.controller('ProductListCtrl', function ($scope, $http) {
    /*   $.post("/getList", {"collection": "testimonial"}, function (data) {
     $scope.list = data;
     });
     */
    var httpRequest = $http({
        method: 'POST',
        url: '/getProductList',
        data: { "collection": "products" }

    }).success(function (data, status) {
        $scope.list = data;
    });

    $scope.objectId = "";
    $scope.deleteModal = function (objectId) {
        $("#deleteModal").modal("show");
        $scope.objectId = objectId;
    }
    $scope.deleteData = function () {
        $("#deleteModal").modal("hide");
        $.post("/deleteData", { "collection": "testimonial", "objectId": $scope.objectId }, function (data) {
        });
        alert("Data deleted successfully!");
        window.location = "/list-testimonials-admin";

    }

});
app.controller('ProductCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#product_text").Editor();

    $.post("/getProductDetails", { "objectId": getQueryStringValue("id") }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data._id;
            $("#order").val(data.order);
            $("#heading").val(data.heading);
            $("#editor1 .Editor-editor").html(decodeURIComponent(data.product_text));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData;
        var url;
        if (getQueryStringValue("id") == "") {
            url = "/insertProductData";
            formData = {
                "order": $("#order").val(),
                "heading": $("#heading").val(),
                "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
                "collection": "products"
            }

        } else {
            url = "/updateProductData";
            formData = {
                "objectId": $scope.objectId,
                "order": $("#order").val(),
                "heading": $("#heading").val(),
                "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
                "collection": "products"
            }
        }
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

    function getQueryStringValue(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

});
app.controller('ContactListCtrl', function ($scope, $http) {
    $.post("/getProductList", { "collection": "contact" }, function (data) {
        $scope.$apply(function () {
            $scope.items = data;
        });

    });
});
app.controller('ContactAddCtrl', function ($scope, $http) {
    $.post("/getContactData", { "objectId": getQueryStringValue("id") }, function (data) {
        $scope.$apply(function () {
            $("#objectId").val(data._id);
            $("#title").val(data.title);
            $("#address").val(data.address);
            $("#location").val(data.location);
            $("#phone").val(data.phone);
            $("#mail").val(data.mail);
        });
    });


    function getQueryStringValue(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }


    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $("#objectId").val(),
            "address": $("#address").val(),
            "title": $("#title").val(),
            "location": $("#location").val(),
            "phone": $("#phone").val(),
            "mail": $("#mail").val(),
            "collection": "contact"
        }
        var url = "/updateProductData";
        var getCallback = function (response) {
            alert("Saved Successfully!")
            window.location = "/admin/contactlist/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });


    });// form submit end


});
app.controller('LoginCtrl', function ($scope, $http) {
    $("#authUser").click(function () {
        // Setting Up Login Call
        var username = $("#username").val();
        var password = $("#password").val();
        var loginJSONdata = '{"username":"' + username + '","password":"' + password + '"}';
        var loginURL = "/login";
        // Login Call Back
        var loginResponseCallback = function (response) {

            if (response.status === "success") {
                window.location.href = "/admin/casestudylist/";
            }
            else {
                $('#error').html('<p class="errornote alert alert-danger"> Please enter the correct username and password. Note that both fields may be case-sensitive. </p>')
            }

        };
        $.ajax({
            url: loginURL,
            type: "POST",
            data: loginJSONdata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: loginResponseCallback
        });
    });

})
app.controller('PartnerListCtrl', function ($scope, $http) {

    $.post("/getPartnerList", {}, function (data) {
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

            var td4 = "<td><a href='/admin/partner?id=" + data[i]["_id"] + "'>Edit Content</a> </td>"
            var trClose = "</tr></tbody>"

            $("#mytable").append(tr + td1 + td2 + td3 + td4 + trClose);

        }
        $("#mytable").append("</tbody>");
    });


})
app.controller('CaseStudyListCtrl', function ($scope, $http) {

    $.post("/getCaseStudyList", function (data) {
        var tbl = $("<table/>").attr("id", "mytable");
        $("#div1").append(tbl);
        $("#mytable").append("<tbody>");

        for (var i = 0; i < data.length; i++) {
            var td1 = "<tr><td>" + data[i]["title"] + "</td>";
            console.log(data);
            var IsPublished;
            if (data[i]["active"] == 'on') {
                IsPublished = " <i class='glyphicon glyphicon-ok'></i>"

            }
            else {
                IsPublished = " <i class='glyphicon glyphicon-remove'></i>"
            }
            var td2 = "<td>" + IsPublished + "</td>";
            var td3 = "<td><a href='/admin/casestudy?id=" + data[i]["_id"] + "'>Edit Content</a> </td>"
            var td4 = "<td><a href='/case-studies/" + data[i]["slug"] + "/' target='_blank'>Preview</a> </td>"
            var trClose = "</tr>"

            $("#mytable").append(td1 + td2 + td3 + td4 + trClose);

        }
        $("#mytable").append("</tbody>");

    });
})
app.controller('CaseStudyAddCtrl', function ($scope, $http) {


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

    var url = "/getCaseStudiesDetails";
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


    //Add
    $('form').submit(function (evt) {
        evt.preventDefault();
        var formDataAppend = "";
        formData = $(this).serialize();
        for (var i = 1; i < 11; i++) {
            formDataAppend += '&editor' + i + '=' + encodeURIComponent($('#editor' + i + ' .Editor-editor').html());
        }

        formData = formData + formDataAppend;
        console.log('formData', formData);
        var url;
        if (getQueryStringValue("id") == '') {
            url = "/addCaseStudies";
        }
        else {

            url = "/editCaseStudies";
        }
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/casestudylist/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback,
            error: function (err) {
                console.log(err);
            }
        });
    });// form submit end


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
            idName = "";
        }
        else if (idName == "#backImage2") {
            $("#image2").val($(this).attr('src'));
            $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
            idName = "";
        }
        else if (idName == "#backImage3") {
            $("#image3").val($(this).attr('src'));
            $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
            idName = "";
        } else {
            $(idName + " .Editor-editor").append('<img src="' + $(this).attr('src') + '"/>');
            idName = "";
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

})
app.controller('PartnerAddCtrl', function ($scope, $http) {
    var url = "/getPartnerDetails";
    var formData = '{"objectId":"' + getQueryStringValue("id") + '"}';

    console.log('--------', formData);

    var getCallback = function (response) {
        console.log(response);
        $.each(response, function (i, item) {
            // console.log('i', i)
            if (i == "_id") {
                // console.log('itemi', item)
                $("#id").val(item);
                // document.getElementById("objectId").value = item;
            }
            else if (i == "active") {
                $('#active').prop('checked', item);
            }
            else if (i == "image1") {
                $("#backImage1").html("<img data-dismiss='modal' width=100 height=100  src='" + item + "'/>");
                $("#image1").val(item);
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


    //Upload CaseStudy  Data
    $('form').submit(function (evt) {
        evt.preventDefault();
        formData = $(this).serialize();
        var url;
        if (getQueryStringValue("id") == '') {
            url = "/addPartners";
        }
        else {
            url = "/editPartners";
        }
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/partnerlist/";
        };
        console.log('formdata', formData)
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });
    });// form submit end

    $("#txtEditor").Editor();
    var idName = "";
    $(document).on("click", "#uploadImage1", function () {
        $("#InsertImage").modal("show");
        idName = "#backImage1";
        $.get("/getPartnerImages", function (response) {
            $("#InsertImage .modal-body").html("");
            $("#InsertImage .modal-body").append("<button class='uploadPartnerImages' class='btn btn-default'>Upload Files</button><div id='myId' class='dropzone'></div>");
            $("#InsertImage .modal-body").append("<div id='thumbwrap'/></div><div style='clear: both;'></div> ");
            $("#thumbwrap").html("");
            $.each(response, function (k, data) {
                $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=100  src='" + data.path + "'/>");

            });
        });
    });


    $(document).on('click', '#InsertImage img', function (e) {
        if (idName == "#backImage1") {
            $("#image1").val($(this).attr('src'));
            $(idName).html('<img width=100 height=100 src="' + $(this).attr('src') + '"/>');
        } else {
            $(".Editor-editor").append('<img width=500 height=300 src="' + $(this).attr('src') + '"/>');
        }
        e.stopImmediatePropagation();
    });


    $(document).on("click", ".uploadPartnerImages", function (e) {
        $("#myId").css("display", "block");
        var myDropzone = new Dropzone("div#myId", {
            url: "/uploadPartnerImages",
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
                    $.get("/getPartnerImages", function (response) {
                        $("#thumbwrap").html("");
                        $.each(response, function (k, data) {
                            $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=100  src='" + data.path + "'/>");

                        });
                    });
                })

            }
        });
    });

})
app.controller('BlogListCtrl', function ($scope, $http) {

    $.post("/getBlogList", {}, function (data) {
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
            var td4 = "<td><a href='/admin/blog?id=" + data[i]["_id"] + "'>Edit Content</a> </td></tr>"


            $("#mytable").append(td1 + td2 + td3 + td4);

        }
        $("#mytable").append("</tbody>");

    });


});
app.controller('BlogAddCtrl', function ($scope, $http) {
    $.get("/getAuthorList", function (response) {
        $.each(response, function (k, data) {
            $("#authorList").append("<label> <input type='checkbox' class='radio' value='" + data._id + "' name='author'/>" + data.first_name + "</label>");
        });

    });

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
                for (var j = 0; j < item.length; j++) {
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
    $.ajax({
        url: "/getBlogDetails",
        type: "POST",
        data: '{"objectId":"' + getQueryStringValue("id") + '"}',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: getCallback
    });


    function getQueryStringValue(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }


    $('form').submit(function (evt) {
        evt.preventDefault();
        $("#objectId").val(getQueryStringValue("id"));
        var formDataAppend = "";
        var formData = $(this).serialize();
        formData = formData + '&editor1=' + encodeURIComponent($('.Editor-editor').html());
        var url;
        if (getQueryStringValue("id") == '') {
            url = "/addBlog";
        } else {
            url = "/editBlog";
        }
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/bloglist/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });
    });// form submit end
    $("#txtEditor").Editor();


    var idName = "";
    $(document).on("click", "#uploadImage1", function () {
        idName = "#backImage1";
        $("#InsertImage").modal("show");
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
    });


    $(document).on('click', '#InsertImage img', function () {
        if (idName == "#backImage1") {
            $("#image1").val($(this).attr('src'));
            $("#thumbImage").val($(this).attr('alt'));
            $(idName).html('<img width=100 height=60 src="' + $(this).attr('src') + '"/>');
            idName = "";
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


});
app.controller('AuthorAddCtrl', function ($scope, $http) {
    var url = "/getAuthorDetails";
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
                $("#backImage1").html("<img data-dismiss='modal' width=100 height=100  src='" + item + "'/>");
                $("#image1").val(item);
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

    //Upload CaseStudy  Data
    $('form').submit(function (evt) {
        evt.preventDefault();
        formData = $(this).serialize();
        var url;
        if (getQueryStringValue("id") == '') {
            url = "/addAuthor";
        }
        else {
            url = "/editAuthor";
        }
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/authorlist/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });
    });// form submit end


    $("#txtEditor").Editor();

    var idName = "";
    $(document).on("click", "#uploadImage1", function (event) {
        $("#InsertImage").modal("show");
        idName = "#backImage1";
        $.get("/getAuthorImages", function (response) {
            $("#InsertImage .modal-body").html("");
            $("#InsertImage .modal-body").append("<button class='uploadAuthorImages' class='btn btn-default'>Upload Files</button><div id='myId' class='dropzone'></div>");
            $("#InsertImage .modal-body").append("<div id='thumbwrap'/></div><div style='clear: both;'></div> ");
            $("#thumbwrap").html("");
            $.each(response, function (k, data) {
                $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=100  src='" + data.path + "'/>");

            });
        });
    });


    $(document).on('click', '#InsertImage img', function (e) {
        if (idName == "#backImage1") {
            $("#image1").val($(this).attr('src'));
            $(idName).html('<img width=100 height=100 src="' + $(this).attr('src') + '"/>');
        } else {
            $(".Editor-editor").append('<img width=500 height=300 src="' + $(this).attr('src') + '"/>');
        }
        e.stopImmediatePropagation();
    });


    $(document).on("click", ".uploadAuthorImages", function () {
        $("#myId").css("display", "block");
        var myDropzone = new Dropzone("div#myId", {
            url: "/uploadAuthorImages",
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
                    $.get("/getAuthorImages", function (response) {
                        $("#thumbwrap").html("");
                        $.each(response, function (k, data) {
                            $("#thumbwrap").append("<img data-dismiss='modal' width=100 height=100  src='" + data.path + "'/>");

                        });
                    });
                })

            }
        });
    });
});
app.controller('AuthorListCtrl', function ($scope, $http) {

    $.get("/getAuthorList", {}, function (data) {
        console.log(data);
        var tbl = $("<table/>").attr("id", "mytable");
        $("#div1").append(tbl);
        $("#mytable").append("<tbody>");
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
            var td5 = "<td><a href='/admin/author?id=" + data[i]["_id"] + "'>Edit Content</a> </td></tr>"


            $("#mytable").append(td1 + td2 + td3 + td4 + td5);

        }
        $("#mytable").append("</tbody>");

    });


});

app.controller('NewsListCtrl', function ($scope, $http) {


    function formatDate(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }


    $.post("/getNewsList", {}, function (data) {
        var tbl = $("<table/>").attr("id", "mytable");
        $("#div1").append(tbl);
        $("#mytable").append("<tbody>");
        for (var i = 0; i < data.length; i++) {
            var img1 = data[i]["heading"];

            var IsPublished;
            if (data[i]["active"] == 'on') {
                IsPublished = " <i class='glyphicon glyphicon-ok'></i>"

            }
            else {
                IsPublished = " <i class='glyphicon glyphicon-remove'></i>"
            }
            var td1 = "<tr><td>" + IsPublished + "</td>"
            var td2 = "<td>" + formatDate(new Date(data[i]["newsdate"])) + "</td>";
            var td3 = "<td>" + data[i]["heading"] + "</td>"
            var td4 = '<td><img src="' + data[i]["image"] + '" style="height:100px"/></td>'
            var td5 = "<td><a href='/admin/news?id=" + data[i]["_id"] + "'>Edit Content</a> </td></tr>"


            $("#mytable").append(td1 + td2 + td3 + td4 + td5);

        }
        $("#mytable").append("</tbody>");

    });


});

app.controller('fpsCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#product_text").Editor();

    $.post("/getProductList", { "collection": "fps" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].product_text));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "collection": "fps"
        }

        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('mtsCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#product_text").Editor();

    $.post("/getProductList", { "collection": "mts" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].product_text));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "collection": "mts"
        }

        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('pmsCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#product_text").Editor();

    $.post("/getProductList", { "collection": "pms" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].product_text));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "collection": "pms"
        }

        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('besCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#product_text").Editor();

    $.post("/getProductList", { "collection": "bes" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].product_text));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "collection": "bes"
        }

        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('busCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#product_text").Editor();

    $.post("/getProductList", { "collection": "bus" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].product_text));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "collection": "bus"
        }

        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('faqCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#product_text").Editor();

    $.post("/getProductList", { "collection": "faq" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].product_text));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "product_text": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "collection": "faq"
        }

        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('whyuaCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");

    $.post("/getProductList", { "collection": "whyua" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#titletext").val(data[0].titletext);
            $("#text1").val(data[0].text1);
            $("#text2").val(data[0].text2);
            $("#text3").val(data[0].text3);
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "titletext": $("#titletext").val(),
            "text1": $("#text1").val(),
            "text2": $("#text2").val(),
            "text3": $("#text3").val(),
            "collection": "whyua"
        }


        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('HomeCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#text4").Editor();

    $.post("/getProductList", { "collection": "home" }, function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].text4));
            $("#text1").val(data[0].text1);
            $("#text2").val(data[0].text2);
            $("#text3").val(data[0].text3);
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "text4": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "text1": $("#text1").val(),
            "text2": $("#text2").val(),
            "text3": $("#text3").val(),
            "collection": "home"
        }


        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});
app.controller('ABCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#text4").Editor();

    $.post("/getProductList", { "collection": "advisory" }, function (data) {
        $scope.$apply(function () {
            $("#objectId").val(data[0]._id);
            $("#titletext").val(data[0].titletext);
            $("#person1").val(data[0].person1);
            $("#person2").val(data[0].person2);
            $("#person3").val(data[0].person3);
            $("#person4").val(data[0].person4);
            $("#person1_description").val(data[0].person1_description);
            $("#person2_description").val(data[0].person2_description);
            $("#person3_description").val(data[0].person3_description);
            $("#person4_description").val(data[0].person4_description);

        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = $(this).serialize();
        console.log(formData);

        var url = "/updateProductData";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            success: getCallback
        });
    });// form submit end

});

app.controller('campaignCtrl', function ($scope, $http) {

    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    $.post("/getCampaignData", function (data) {
        $scope.$apply(function () {
            $scope.items = data;
            $scope.datalists = $scope.items;

            $scope.curPage = 0;
            $scope.pageSize = 50;
        });

    });


    $scope.numberOfPages = function () {
        return Math.ceil($scope.datalists.length / $scope.pageSize);
    };
});

app.controller('testimonialsCtrl', function ($scope, $http) {

    $.post("/getTestimonials", function (data) {
        $scope.$apply(function () {
            $scope.list = data;
        });

    });

    if (getQueryStringValue("id")) {
        $.post("/getTestimonialDetails", { "objectId": getQueryStringValue("id") }, function (data) {
            $scope.$apply(function () {
                $scope.objectId = data._id;
                // $("#order").val(data.order);
                $("#text1").val(data.name);
                $("#editor1 .Editor-editor").html(decodeURIComponent(data.testimonial));
            });
        });
    }

    $("#successMsg").css("display", "none");
    $("#text4").Editor();

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "testimonial": encodeURIComponent($('#editor1 .Editor-editor').html()),
            "name": $("#text1").val(),
        }

        var url;

        if (getQueryStringValue("id") == '') {
            url = "/addtestimonials";
        }
        else {
            formData.objectId = getQueryStringValue("id");
            url = "/edittestimonials";
        }
        // var url = "/addtestimonials";
        var getCallback = function (response) {
            $("#successMsg").css("display", "block");
            window.location = "/admin/testimonials/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

    function getQueryStringValue(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }
})

app.controller('loaCtrl', function ($scope, $http) {

    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    $.post("/getLOAData", function (data) {
        $scope.$apply(function () {
            $scope.items = data;
            $scope.datalists = $scope.items;

            $scope.curPage = 0;
            $scope.pageSize = 50;
        });

    });


    $scope.numberOfPages = function () {
        return Math.ceil($scope.datalists.length / $scope.pageSize);
    };
});

app.controller('ContactdataCtrl', function ($scope, $http) {

    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    $.post("/getContactFormData", function (data) {
        $scope.$apply(function () {
            $scope.items = data;
            $scope.datalists = $scope.items;

            $scope.curPage = 0;
            $scope.pageSize = 50;
        });

    });


    $scope.numberOfPages = function () {
        return Math.ceil($scope.datalists.length / $scope.pageSize);
    };
});

// Our services code

app.controller('invoicevalidationCtrl', function ($scope, $http) {

    console.log("in invoicevalidationCtrl")

    $("#txtEditor23").Editor();
    $("#txtEditor21").Editor();
    $("#txtEditor22").Editor();

    $("#txtEditor31").Editor();
    $("#txtEditor41").Editor();

    $.get("/getInvoiceValidationPageData", function (data) {
        $scope.objectId = "";
        $scope.$apply(function () {
            $scope.voidItems = data;
            $scope.objectId = data[0]._id;
            $("#txtEditor3 .Editor-editor").html(decodeURIComponent(data[0].txtEditor3));
            $("#text1").val(data[0].text1);
            $("#text2").val(data[0].text2);
            $("#text3").val(data[0].text3);
            $("#txtEditor1 .Editor-editor").html(decodeURIComponent(data[0].txtEditor1));
            $("#txtEditor2 .Editor-editor").html(decodeURIComponent(data[0].txtEditor2));
            $("#txtEditor4 .Editor-editor").html(decodeURIComponent(data[0].txtEditor4));
            $("#txtEditor5 .Editor-editor").html(decodeURIComponent(data[0].txtEditor5));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        // $("#objectId").val(getQueryStringValue("id"));
        var formDataAppend = "";
        var formData = $(this).serialize();

        let txtEditor1 = encodeURIComponent($('#txtEditor1 .Editor-editor').html())
        let txtEditor2 = encodeURIComponent($('#txtEditor2 .Editor-editor').html())
        let txtEditor3 = encodeURIComponent($('#txtEditor3 .Editor-editor').html())
        let txtEditor4 = encodeURIComponent($('#txtEditor4 .Editor-editor').html())
        let txtEditor5 = encodeURIComponent($('#txtEditor5 .Editor-editor').html())
        // formData = formData + '&txtEditor=' + txtEditor+'&txtEditor1='+txtEditor1+'&txtEditor2='+txtEditor2+"&objectId="+$scope.objectId;
        // console.log("formData", formData);
        let formData1 = {
            txtEditor1: txtEditor1,
            txtEditor2: txtEditor2,
            txtEditor3: txtEditor3,
            txtEditor4: txtEditor4,
            txtEditor5: txtEditor5,
            objectId: $scope.objectId,
            text1: $("#text1").val(),
            text2: $("#text2").val(),
            text3: $("#text3").val()
        }
        console.log("formData1", formData1);
        var url;
        if (!$scope.objectId) {
            url = "/addInvoiceValidationPageData";
        } else {
            url = "/editInvoiceValidationPageData";
        }
        console.log("");
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/invoicevalidation/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData1,
            success: getCallback
        });
    });
});

app.controller('netZeroCtrl', function ($scope, $http) {

    console.log("in netZeroCtrl")

    $("#txtEditor23").Editor();
    $("#txtEditor21").Editor();
    $("#txtEditor22").Editor();

    $("#txtEditor31").Editor();
    $("#txtEditor41").Editor();

    $.get("/getNetZeroPageData", function (data) {
        $scope.objectId = "";
        $scope.$apply(function () {
            $scope.voidItems = data;
            $scope.objectId = data[0]._id;
            $("#txtEditor3 .Editor-editor").html(decodeURIComponent(data[0].txtEditor3));
            $("#text1").val(data[0].text1);
            $("#txtEditor1 .Editor-editor").html(decodeURIComponent(data[0].txtEditor1));
            $("#txtEditor2 .Editor-editor").html(decodeURIComponent(data[0].txtEditor2));
            $("#txtEditor4 .Editor-editor").html(decodeURIComponent(data[0].txtEditor4));
            $("#txtEditor5 .Editor-editor").html(decodeURIComponent(data[0].txtEditor5));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        // $("#objectId").val(getQueryStringValue("id"));
        var formDataAppend = "";
        var formData = $(this).serialize();

        let txtEditor1 = encodeURIComponent($('#txtEditor1 .Editor-editor').html())
        let txtEditor2 = encodeURIComponent($('#txtEditor2 .Editor-editor').html())
        let txtEditor3 = encodeURIComponent($('#txtEditor3 .Editor-editor').html())
        let txtEditor4 = encodeURIComponent($('#txtEditor4 .Editor-editor').html())
        let txtEditor5 = encodeURIComponent($('#txtEditor5 .Editor-editor').html())
        // formData = formData + '&txtEditor=' + txtEditor+'&txtEditor1='+txtEditor1+'&txtEditor2='+txtEditor2+"&objectId="+$scope.objectId;
        // console.log("formData", formData);
        let formData1 = {
            txtEditor1: txtEditor1,
            txtEditor2: txtEditor2,
            txtEditor3: txtEditor3,
            txtEditor4: txtEditor4,
            txtEditor5: txtEditor5,
            objectId: $scope.objectId,
            text1: $("#text1").val()
        }
        console.log("formData1", formData1);
        var url;
        if (!$scope.objectId) {
            url = "/addNetZeroPageData";
        } else {
            url = "/editNetZeroPageData";
        }
        console.log("");
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/netzero/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData1,
            success: getCallback
        });
    });
});

app.controller('voidmanagementCtrl', function ($scope, $http) {

    console.log("in voidmanagementCtrl");
    $("#txtEditor20").Editor();
    $("#txtEditor21").Editor();
    $("#txtEditor22").Editor();

    $.get("/getVoidManagementServicePageData", function (data) {
        $scope.$apply(function () {
            $scope.voidItems = data;
            $scope.objectId = data[0]._id;
            $("#txtEditor .Editor-editor").html(decodeURIComponent(data[0].txtEditor));
            $("#text1").val(data[0].text1);
            $("#txtEditor1 .Editor-editor").html(decodeURIComponent(data[0].txtEditor1));
            $("#txtEditor2 .Editor-editor").html(decodeURIComponent(data[0].txtEditor2));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        // $("#objectId").val(getQueryStringValue("id"));
        var formDataAppend = "";
        var formData = $(this).serialize();
        let txtEditor = encodeURIComponent($('#txtEditor .Editor-editor').html())
        let txtEditor1 = encodeURIComponent($('#txtEditor1 .Editor-editor').html())
        let txtEditor2 = encodeURIComponent($('#txtEditor2 .Editor-editor').html())
        // formData = formData + '&txtEditor=' + txtEditor+'&txtEditor1='+txtEditor1+'&txtEditor2='+txtEditor2+"&objectId="+$scope.objectId;
        // console.log("formData", formData);
        let formData1 = {
            txtEditor: txtEditor,
            txtEditor1: txtEditor1,
            txtEditor2: txtEditor2,
            objectId: $scope.objectId,
            text1: $("#text1").val()
        }
        console.log("formData1", formData1);
        var url;
        if (!objectId) {
            url = "/addVoidManagementServicePageData";
        } else {
            url = "/editVoidManagementServicePageData";
        }
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/voidmanagement/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData1,
            success: getCallback
        });
    });
});

app.controller('customercareCtrl', function ($scope, $http) {

    console.log("in customercareCtrl")

    // $("#txtEditor23").Editor();
    $("#txtEditor21").Editor();
    // $("#txtEditor22").Editor();

    // $("#txtEditor31").Editor();
    // $("#txtEditor41").Editor();

    $.get("/getCustomerCarePageData", function (data) {
        $scope.objectId = "";
        $scope.$apply(function () {
            $scope.voidItems = data;
            $scope.objectId = data[0]._id;
            // $("#txtEditor3 .Editor-editor").html(decodeURIComponent(data[0].txtEditor3));
            $("#text1").val(data[0].text1);
            $("#txtEditor1 .Editor-editor").html(decodeURIComponent(data[0].txtEditor1));
            // $("#txtEditor2 .Editor-editor").html(decodeURIComponent(data[0].txtEditor2));
            // $("#txtEditor4 .Editor-editor").html(decodeURIComponent(data[0].txtEditor4));
            // $("#txtEditor5 .Editor-editor").html(decodeURIComponent(data[0].txtEditor5));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        // $("#objectId").val(getQueryStringValue("id"));
        var formDataAppend = "";
        var formData = $(this).serialize();

        let txtEditor1 = encodeURIComponent($('#txtEditor1 .Editor-editor').html())
        // let txtEditor2 = encodeURIComponent($('#txtEditor2 .Editor-editor').html())
        // let txtEditor3 = encodeURIComponent($('#txtEditor3 .Editor-editor').html())
        // let txtEditor4 = encodeURIComponent($('#txtEditor4 .Editor-editor').html())
        // let txtEditor5 = encodeURIComponent($('#txtEditor5 .Editor-editor').html())
        // formData = formData + '&txtEditor=' + txtEditor+'&txtEditor1='+txtEditor1+'&txtEditor2='+txtEditor2+"&objectId="+$scope.objectId;
        // console.log("formData", formData);
        let formData1 = {
            txtEditor1: txtEditor1,
            // txtEditor2: txtEditor2,
            // txtEditor3: txtEditor3,
            // txtEditor4: txtEditor4,
            // txtEditor5: txtEditor5,
            objectId: $scope.objectId,
            text1: $("#text1").val()
        }
        console.log("formData1", formData1);
        var url;
        if (!$scope.objectId) {
            url = "/addCustomerCarePageData";
        } else {
            url = "/editCustomerCarePageData";
        }
        console.log("");
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/customercare/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData1,
            success: getCallback
        });
    });
});

app.controller('accountmanagementCtrl', function ($scope, $http) {

    console.log("in accountmanagementCtrl")
    $("#txtEditor21").Editor();

    $.get("/getAccountManagementPageData", function (data) {
        $scope.objectId = "";
        $scope.$apply(function () {
            $scope.voidItems = data;
            $scope.objectId = data[0]._id;
            $("#txtEditor1 .Editor-editor").html(decodeURIComponent(data[0].txtEditor1));
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formDataAppend = "";
        var formData = $(this).serialize();

        let txtEditor1 = encodeURIComponent($('#txtEditor1 .Editor-editor').html())
        let formData1 = {
            txtEditor1: txtEditor1,
            objectId: $scope.objectId
        }
        console.log("formData1", formData1);
        var url;
        if (!$scope.objectId) {
            url = "/addAccountManagementPageData";
        } else {
            url = "/editAccountManagementPageData";
        }
        console.log("");
        var getCallback = function (response) {
            alert("Data added successfully!");
            window.location = "/admin/accountmanagement/";
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData1,
            success: getCallback
        });
    });
});

app.controller('ourHeritageCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    // $("#text4").Editor();

    $.get("/getOurHeritagePageData", function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            // $("#editor1 .Editor-editor").html(decodeURIComponent(data[0].text4));
            $("#text1").val(data[0].text1);
            $("#text2").val(data[0].text2);
            $("#text3").val(data[0].text3);
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "text1": $("#text1").val(),
            "text2": $("#text2").val(),
            "text3": $("#text3").val(),
            "collection": "ourheritage"
        }


        var url = "/editOurHeritagePageData";
        if (!$scope.objectId) {
            url = "/addOurHeritagePageData";
        } else {
            url = "/editOurHeritagePageData";
        }
        var getCallback = function (response) {
            alert("Data added successfully!");
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});

app.controller('TeamListCtrl', function ($scope, $http) {


    function formatDate(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }


    $.get("/getOurTeamPageData", {}, function (data) {
        var tbl = $("<table/>").attr("id", "mytable");
        $("#div1").append(tbl);
        $("#mytable").append("<tbody>");
        for (var i = 0; i < data.length; i++) {
            var img1 = data[i]["heading"];

            var IsPublished;
            if (data[i]["active"] == 'on') {
                IsPublished = " <i class='glyphicon glyphicon-ok'></i>"

            }
            else {
                IsPublished = " <i class='glyphicon glyphicon-remove'></i>"
            }
            var td1 = "<tr><td>" + IsPublished + "</td>"
            var td2 = "<td>" + data[i]["name"] + "</td>";
            var td3 = "<td>" + data[i]["heading"] + "</td>"
            var td4 = '<td><img src="' + data[i]["image"] + '" style="height:100px"/></td>'
            var td5 = "<td><a href='/admin/team?id=" + data[i]["_id"] + "'>Edit Content</a> </td></tr>"


            $("#mytable").append(td1 + td2 + td3 + td4 + td5);

        }
        $("#mytable").append("</tbody>");

    });


});

app.controller('nationalCharityCtrl', function ($scope, $http) {
    $("#successMsg").css("display", "none");
    $("#text4").Editor();

    $.get("/getNationalCharityTenderData", function (data) {
        $scope.$apply(function () {
            $scope.objectId = data[0]._id;
            $("#txtEditor4 .Editor-editor").html(decodeURIComponent(data[0].text4));
            $("#text1").val(data[0].text1);
            $("#text2").val(data[0].text2);
            $("#text3").val(data[0].text3);
        });
    });

    $('form').submit(function (evt) {
        evt.preventDefault();
        var formData = {
            "objectId": $scope.objectId,
            "text1": $("#text1").val(),
            "text2": $("#text2").val(),
            "text3": $("#text3").val(),
            "text4": encodeURIComponent($('#txtEditor4 .Editor-editor').html()),
            "collection": "national_charity"
        }


        var url = "/editOurHeritagePageData";
        if (!$scope.objectId) {
            url = "/addNationalCharityTenderData";
        } else {
            url = "/editNationalCharityTenderData";
        }
        var getCallback = function (response) {
            alert("Data added successfully!");
            $("#successMsg").css("display", "block");
        };
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: getCallback
        });
    });// form submit end

});

app.filter('startPagination', function () {
    return function (input, start) {
        start = +start;
        return input.slice(start);
    };
});

app.directive('emitLastRepeaterElement', function () {
    return function (scope) {
        if (scope.$last) {
            scope.$emit('LastRepeaterElement');
        }
    };
});
app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);












