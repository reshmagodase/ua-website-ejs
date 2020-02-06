"use strict";
// Declare app level module which depends on views, and components
var app = angular.module("myApp", ["ngRoute", "ngSanitize", "ngStorage"]);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix("!");
  $routeProvider
    .when("/", {
      templateUrl: "views/home.html",
      controller: "HomeCtrl"
    })
    .when("/home/", {
      templateUrl: "views/home.html",
      controller: "HomeCtrl"
    })

    .when("/why-ua/", {
      templateUrl: "views/why-ua.html",
      controller: "whyuaController"
    })

    .when("/ua-blog/", {
      templateUrl: "views/ua-blog.html",
      controller: "DefaultController"
    })
    .when("/blog/", {
      templateUrl: "views/why-ua.html",
      controller: "whyuaController"
    })
    .when("/our-products/", {
      templateUrl: "views/our-products.html",
      controller: "ourproductsController"
    })
    .when("/our-clients-say/", {
      templateUrl: "views/our-clients-say.html",
      controller: "ourclientssayController"
    })
    .when("/case-studies/", {
      templateUrl: "views/case-studies.html",
      controller: "caseStudiesController"
    })
    .when("/advisory-board/", {
      templateUrl: "views/advisory-board.html",
      controller: "advisoryboardController"
    })
    .when("/about/", {
      templateUrl: "views/advisory-board.html",
      controller: "advisoryboardController"
    })
    .when("/faq/", {
      templateUrl: "views/faq.html",
      controller: "faqCtrl"
    })
    .when("/media/", {
      templateUrl: "views/news.html",
      controller: "newsCtrl"
    })

    .when("/contact/", {
      templateUrl: "views/contact.html",
      controller: "contactController"
    })
    .when("/contact-ask/", {
      templateUrl: "views/contact-ask.html",
      controller: "contactAskController"
    })
    .when("/bribery-act-statement/", {
      templateUrl: "views/bribery-act-statement.html",
      controller: "DefaultController"
    })
    .when("/environmental-policy/", {
      templateUrl: "views/environmental-policy.html",
      controller: "DefaultController"
    })
    .when("/privacy-policy/", {
      templateUrl: "views/privacy-policy.html",
      controller: "DefaultController"
    })
    .when("/case-studies/:group*", {
      templateUrl: "views/case-studies/case-study.html",
      controller: "CaseStudiesDetailsController"
    })

    .when("/blog/:group*", {
      templateUrl: "views/blog/articles.html",
      controller: "BlogDetailsController"
    })
    .when("/news-media/:group*", {
      templateUrl: "views/news-blogs/news-blogs.html",
      controller: "NewsDetailsController"
    })

    .when("/request/", {
      templateUrl: "views/request.html",
      controller: "RequestController"
    })
    .when("/thankyou/", {
      templateUrl: "views/thankyou.html",
      controller: "DefaultController"
    })
    .when("/thank-you/", {
      templateUrl: "views/thank-you.html",
      controller: "DefaultController"
    })
    .when("/engine/", {
      templateUrl: "views/engine.html"
    })
    .when("/energyswitching/", {
      templateUrl: "views/energyswitching.html",
      controller: "EnergyController"
    })
    .when("/workwithus/", {
      templateUrl: "views/workwithus.html",
      controller: "WorkWithUsController"
    })
    .when("/success/", {
      templateUrl: "views/emailCampaign.html",
      controller: "EmailCampaignController"
    })
    .when("/addtocall/", {
      templateUrl: "views/loa.html",
      controller: "EmailCampaignController"
    })
    .when("/sendloa/", {
      templateUrl: "views/sendloa.html",
      controller: "EmailCampaignController"
    })
    .when("/loa-upload/", {
      templateUrl: "views/loaupload.html",
      controller: "LOAUploadController"
    })
    .otherwise({
      redirectTo: "/"
    });
});

app.controller("DefaultController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Energy and Utilities Consultancy",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/logoUA.png",
    ogurl: "https://www.utility-aid.co.uk/"
  };
});
app.controller("whyuaController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Why UA?",
    ogDescripton:
      "We primarily work in the Not-for-Profit sector. So, suppliers give us the lowest prices in the UK - guaranteed.",
    ogImage: "https://www.utility-aid.co.uk/img/whyua/whyua.jpg",
    ogurl: "https://www.utility-aid.co.uk/why-ua/"
  };

  $.post("/getProductList", { collection: "whyua" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#titletext").html(data[0].titletext.replace(/\r\n|\r|\n/g, "<br />"));
      $("#text1").html(data[0].text1.replace(/\r\n|\r|\n/g, "<br />"));
      $("#text2").html(data[0].text2.replace(/\r\n|\r|\n/g, "<br />"));
      $("#text3").html(data[0].text3.replace(/\r\n|\r|\n/g, "<br />"));
    });
  });
});
/*app.controller('blogController', function ($scope, $http) {
 $scope.$parent.seo = {
 pageTitle: "UA | Blogs",
 ogTitle: "UA | Blogs",
 pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
 ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
 };
 })*/
app.controller("ourproductsController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Our Products",
    ogDescripton:
      "Fixed Price Strategy, Market Trigger Strategy, Portfolio Managed Strategy, Bespoke Strategy, Bureau Services",
    ogImage: "https://www.utility-aid.co.uk/img/products/products.jpg",
    ogurl: "https://www.utility-aid.co.uk/our-products/"
  };
});

app.controller("EnergyController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Energy Switching",
    ogDescripton: "Compare your gas and electricity",
    ogImage: "https://www.utility-aid.co.uk/logoUA.png",
    ogurl: "https://www.utility-aid.co.uk/energyswitching/"
  };
});

app.controller("ourclientssayController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Our Clients Say",
    ogDescripton:
      "Going through the energy audit process with ua has been extremely useful. It not only highlighted the savings to be made but saved us valuable time.",
    ogImage: "https://www.utility-aid.co.uk/img/clients/clients.jpg",
    ogurl: "https://www.utility-aid.co.uk/our-clients-say/"
  };
});
app.controller("caseStudiesController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Case Studies",
    ogDescripton:
      "Going through the energy audit process with ua has been extremely useful. It not only highlighted the savings to be made but saved us valuable time.",
    ogImage: "https://www.utility-aid.co.uk/img/clients/clients.jpg",
    ogurl: "https://www.utility-aid.co.uk/our-clients-say/"
  };
});
app.controller("advisoryboardController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Advisory Board",
    ogDescripton:
      "UA is proud to be the only energy broker in the UK that employs an Independent Advisory Panel. The panel is there for the benefit of customers requiring advisory services relating to a range of topics including Ethics, Regulation, Lobbying, Trading, Volume Purchasing, Fixed and Flexible products and Exotic Instruments.",
    ogImage:
      "https://www.utility-aid.co.uk/img/advisoryboard/advisoryboard.jpg",
    ogurl: "https://www.utility-aid.co.uk/advisory-board/"
  };
  $.post("/getProductList", { collection: "advisory" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#titletext").html(data[0].titletext.replace(/\r\n|\r|\n/g, "<br />"));
      $("#person1").html(data[0].person1.replace(/\r\n|\r|\n/g, "<br />"));
      $("#person2").html(data[0].person2.replace(/\r\n|\r|\n/g, "<br />"));
      $("#person3").html(data[0].person3.replace(/\r\n|\r|\n/g, "<br />"));
      $("#person4").html(data[0].person4.replace(/\r\n|\r|\n/g, "<br />"));
      $("#person1_description").html(
        data[0].person1_description.replace(/\r\n|\r|\n/g, "<br />")
      );
      $("#person2_description").html(
        data[0].person2_description.replace(/\r\n|\r|\n/g, "<br />")
      );
      $("#person3_description").html(
        data[0].person3_description.replace(/\r\n|\r|\n/g, "<br />")
      );
      $("#person4_description").html(
        data[0].person4_description.replace(/\r\n|\r|\n/g, "<br />")
      );
    });
  });
});

app.controller("contactController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Contact",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/logoUA.png",
    ogurl: "https://www.utility-aid.co.uk/contact/"
  };
  $.post("/getProductList", { collection: "contact" }, function (data) {
    $scope.$apply(function () {
      $scope.items = data;
    });
  });
});
app.controller("contactAskController", function ($scope, $http) {
  $(".askButton").click();
  $scope.$parent.seo = {
    ogTitle: "UA | Contact",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/logoUA.png",
    ogurl: "https://www.utility-aid.co.uk/contact/"
  };
  $.post("/getProductList", { collection: "contact" }, function (data) {
    $scope.$apply(function () {
      $scope.items = data;
    });
  });
});
app.controller("CaseStudiesController", function ($scope, $http) {
  $scope.CaseStudies = [];
  $.post("/getCaseStudyList", { active: "on" }, function (data) {
    $scope.$apply(function () {
      $scope.CaseStudies = data;
    });
  });
});
app.controller("PartnersController", function ($scope, $http) {
  $scope.Partners = [];
  $.post("/getPartnerList", { active: "on" }, function (data) {
    $scope.$apply(function () {
      $scope.Partners = data;
    });
  });
});
app.controller("productsCtrl", function ($scope, $http) {
  $scope.Products = [];
  $.post("/getProductList", { collection: "products" }, function (data) {
    var html = '<div class="responsive-tabs">';

    for (var i = 0; i < data.length; i++) {
      html +=
        "<h2>" +
        data[i].heading +
        '</h2><div class="container-fluid data"><div class="container">  <h3>' +
        data[i].heading +
        "</h3>" +
        decodeURIComponent(data[i].product_text).replace(/(?:&nbsp;)/g, " ") +
        "</div></div>";
    }
    html += "</div>";
    $("#tag").html(html);

    RESPONSIVEUI.responsiveTabs();
  });
});
app.controller("BlogsController", function ($scope, $http) {
  $scope.formatDate = function (date) {
    var dateString = date;
    var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    var dateArray = reggie.exec(dateString);
    var dateObject = new Date(
      +dateArray[1],
      +dateArray[2] - 1, // Careful, month starts at 0!
      +dateArray[3],
      +dateArray[4],
      +dateArray[5],
      +dateArray[6]
    );

    return dateObject;
  };

  $.post("/getBlogList", { active: "on" }, function (data) {
    $scope.$apply(function () {
      $scope.Blogs = data;
    });
  });
});
app.controller("CaseStudiesDetailsController", function (
  $scope,
  $location,
  $http
) {
  var url = window.location.toString();
  var parts = url.split("/");
  var slug = "";
  if ((parts[parts.length - 1] = "")) {
    slug = parts[parts.length - 1];
  } else {
    slug = parts[parts.length - 2];
  }
  $.post("/getCaseStudyList", { slug: slug }, function (data) {
    $scope.$apply(function () {
      var result = data[0];
      $scope.$parent.seo = {
        ogTitle: "UA | " + data[0].title,
        ogDescripton: data[0].meta_data_meta_description,
        ogImage: "https://www.utility-aid.co.uk/" + data[0].image1,
        ogurl: url
      };

      $scope.banner_col_1_title = result.banner_col_1_title;
      $scope.banner_col_1_text = result.banner_col_1_text;
      $scope.banner_col_2_title = result.banner_col_2_title;
      $scope.banner_col_2_text = result.banner_col_2_text;
      $scope.banner_col_3_title = result.banner_col_3_title;
      $scope.banner_col_3_text = result.banner_col_3_text;
      $scope.banner_title = result.banner_title;

      $scope.block_1_title = result.block_1_title;
      $scope.block_1_sub_title = result.block_1_sub_title;
      $scope.block_1_col_1_title = result.block_1_col_1_title;
      $scope.block_1_col_2_title = result.block_1_col_2_title;
      $scope.block_1_col_3_title = result.block_1_col_3_title;

      $scope.block_2_quote = result.block_2_quote;
      $scope.block_2_author = result.block_2_author;
      $scope.block_2_city = result.block_2_city;

      $scope.block_3_title = result.block_3_title;
      $scope.block_3_sub_title = result.block_3_sub_title;
      $scope.block_3_col_1_title = result.block_3_col_1_title;
      $scope.block_3_col_2_title = result.block_3_col_2_title;
      $scope.block_3_col_3_title = result.block_3_col_3_title;

      $scope.block_4_quote = result.block_4_quote;
      $scope.block_4_author = result.block_4_author;
      $scope.block_4_city = result.block_4_city;

      $scope.block_5_title = result.block_5_title;
      $scope.block_5_sub_title = result.block_5_sub_title;
      $scope.block_5_col_1_title = result.block_5_col_1_title;
      $scope.block_5_col_2_title = result.block_5_col_2_title;
      $scope.block_5_col_3_title = result.block_5_col_3_title;

      $scope.image1 = data[0].image1;
      $scope.image2 = data[0].image2;
      $scope.image3 = data[0].image3;

      var value = result.editor1;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor1 = value;
      var value = result.editor2;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor2 = value;
      var value = result.editor3;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor3 = value;
      var value = result.editor4;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor4 = value;
      var value = result.editor5;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor5 = value;
      var value = result.editor6;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor6 = value;
      var value = result.editor7;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor7 = value;
      var value = result.editor8;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor8 = value;
      var value = result.editor9;
      value = value.replace(/&nbsp;/g, " ");
      $scope.editor9 = value;
    });
  });
});
app.controller("BlogDetailsController", function (
  $scope,
  $location,
  $localStorage,
  $http
) {
  $scope.formatDate = function (date) {
    var dateString = date;
    var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    var dateArray = reggie.exec(dateString);
    var dateObject = new Date(
      +dateArray[1],
      +dateArray[2] - 1, // Careful, month starts at 0!
      +dateArray[3],
      +dateArray[4],
      +dateArray[5],
      +dateArray[6]
    );

    return dateObject;
  };

  var url = window.location.toString();
  var parts = url.split("/");
  var slug = "";
  if ((parts[parts.length - 1] = "")) {
    slug = parts[parts.length - 1];
  } else {
    slug = parts[parts.length - 2];
  }

  $.post("/getBlogList", { slug: slug }, function (data) {
    $scope.$apply(function () {
      $scope.$parent.seo = {
        ogTitle: "UA | " + data[0].title,
        ogDescripton: data[0].meta_data_meta_description,
        ogImage: "https://www.utility-aid.co.uk/" + data[0].image1,
        ogurl: url
      };
      var authorList = data[0].author;
      $scope.Author = [];
      if (Array.isArray(authorList)) {
        for (var k = 0; k < authorList.length; k++) {
          $http({
            url: "/getAuthorList",
            method: "GEt",
            dataType: "json",
            contentType: "application/json; charset=utf-8"
          }) /* .success(function (response) {

                        for (var j = 0; j < response.length; j++) {
                            if (response[j]._id == authorList[k]) {
                                $scope.Author.push(response[j]);

                            }
                        }
                    }
                    ); */
            .then(
              function (response) {
                for (var j = 0; j < response.length; j++) {
                  if (response[j]._id == authorList[k]) {
                    $scope.Author.push(response[j]);
                  }
                }
              },
              function (error) { }
            );
        }
      } else {
        $http({
          url: "/getAuthorList",
          method: "GET",
          dataType: "json",
          contentType: "application/json; charset=utf-8"
        }) /* .success(function (response) {
                    console.log(response);
                    for (var j = 0; j < response.length; j++) {
                        if (response[j]._id == authorList) {
                            $scope.Author.push(response[j]);

                        }
                    }
                }
                ); */
          .then(
            function (response) {
              console.log(response);
              for (var j = 0; j < response.length; j++) {
                if (response[j]._id == authorList) {
                  $scope.Author.push(response[j]);
                }
              }
            },
            function (error) { }
          );
      }

      $scope.image1 = data[0].image1;
      $scope.page_content_extended_title = data[0].page_content_extended_title;
      var dateString = data[0].publish_date_0;
      var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
      var dateArray = reggie.exec(dateString);
      var dateObject = new Date(
        +dateArray[1],
        +dateArray[2] - 1, // Careful, month starts at 0!
        +dateArray[3],
        +dateArray[4],
        +dateArray[5],
        +dateArray[6]
      );
      $scope.publish_date_0 = dateObject;
      var value = data[0].editor1;
      value = value.replace(/&nbsp;/g, " ");
      $("#editor1").html("");
      $("#editor1").append(value);
      $("#editor1")
        .find("*")
        .removeAttr("style");

      $("#sharer").html(
        '<a class="facebook" href="#"></a> <a class="tweet" href="#" title="' +
        data[0].title +
        ' @UA_Energy"></a>'
      );
      var loc = window.location.href;
      var title = "UA | " + data[0].title;
      var summary = data[0].meta_data_meta_description;
      var thumbImage = "https://www.utility-aid.co.uk/" + data[0].image1;
      $("a.facebook").click(function (e) {
        e.preventDefault();
        FB.ui({
          method: "feed",
          name: title,
          link: loc,
          picture: thumbImage,
          caption: "www.utility-aid.co.uk",
          description: summary,
          message: ""
        });
      });

      var loctw = window.location.href;
      var titletw = data[0].title;
      $("a.tweet").click(function (e) {
        e.preventDefault();
        window.open(
          "https://twitter.com/share?url=" + loctw + "&text=" + titletw,
          "twitterwindow",
          "height=450, width=550, top=" +
          ($(window).height() / 2 - 225) +
          ", left=" +
          $(window).width() / 2 +
          ", toolbar=0, location=0, menubar=0, directories=0, scrollbars=0"
        );
      });
    });
  });
  $.post("/getBlogList", { active: "on" }, function (data) {
    $scope.$apply(function () {
      $scope.Article = data.slice(0, 3);
      for (var k = 0; k < $scope.Article.length; k++) {
        if ($scope.Article[k].slug == slug) {
          $scope.Article.splice(k, 1);
        }
      }
      if ($scope.Article.length == 3) {
        $scope.Article.splice(2, 1);
      }
    });
  });
});
app.controller("newsCtrl", function ($scope, $location, $localStorage, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Media",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/img/blog/news.jpg",
    ogurl: "https://www.utility-aid.co.uk/news/"
  };
});
app.controller("NewsDetailsController", function (
  $scope,
  $location,
  $localStorage,
  $http
) {
  $scope.formatDate = function (date) {
    var dateString = date;
    var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    var dateArray = reggie.exec(dateString);
    var dateObject = new Date(
      +dateArray[1],
      +dateArray[2] - 1, // Careful, month starts at 0!
      +dateArray[3],
      +dateArray[4],
      +dateArray[5],
      +dateArray[6]
    );

    return dateObject;
  };

  var url = window.location.toString();
  var parts = url.split("/");
  var slug = "";
  if ((parts[parts.length - 1] = "")) {
    slug = parts[parts.length - 1];
  } else {
    slug = parts[parts.length - 2];
  }

  function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }

  $.post("/getNewsDetails", { heading: slug }, function (data) {
    var desc = data.description.toString().substring(0, 150);
    $scope.$parent.seo = {
      ogTitle: "UA | " + data.heading,
      ogDescripton: desc,
      ogImage: "https://www.utility-aid.co.uk" + data.image,
      ogurl: url
    };
    $scope.$apply(function () {
      console.log(data);
      $scope.image = data.image;
      $scope.heading = data.heading;
      $("#description1").html(data.description.replace(/\r?\n/g, "<br/>"));
      $scope.newsdate = formatDate(new Date(data.newsdate));
    });
  });
});

app.controller("RequestController", function ($scope, $location, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Request your free energy consultation",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/logoUA.png",
    ogurl: window.location.href
  };
  $scope.addUser = function () {
    if (!$scope.validate()) {
      return false;
    } else {
      $scope.requestData = {};
      $scope.requestData.title = $scope.title;
      $scope.requestData.contact_number = $scope.contact_number;
      $scope.requestData.company_name = $scope.company_name;
      $scope.requestData.position = $scope.position;
      $scope.requestData.current_supplier = $scope.current_supplier;
      $scope.requestData.annual_energy_costs = $scope.annual_energy_costs;
      $scope.requestData.msg = $scope.msg;
      $scope.requestData.fullName = $scope.fullName;
      $scope.requestData.email = $scope.email;
      $scope.requestData.msg = $scope.msg;
      $scope.requestData.audit = $scope.audit;
      $scope.requestData.hearfrom = $scope.hearfrom;

      $http({
        url: "/sendRequestMail",
        method: "POST",
        data: $scope.requestData,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
      }).then(
        function (data, status) {
          window.location = "/thank-you/";
        },
        function (error) {
          console.log("in error");
        }
      );
    }
  };

  $scope.makeEmptyValidators = function () {
    $("#fullnameID").html("");
    $("#emailID").html("");
    $("#msgID").html("");
    $("#auditID").html("");
    $("#hearfromID").html("");
  };

  $scope.validate = function () {
    $scope.makeEmptyValidators();
    var temp = false;
    if ($scope.fullName == "" || $scope.fullName == undefined) {
      $("#fullnameID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.email == "" || $scope.email == undefined) {
      $("#emailID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.msg == "" || $scope.msg == undefined) {
      $("#msgID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.audit == "" || $scope.audit == undefined) {
      $("#auditID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.hearfrom == "" || $scope.hearfrom == undefined) {
      $("#hearfromID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.email != "") {
      if (!validateEmail($scope.email)) {
        $("#emailID").html(
          "<ul class='errorlist'>Please enter correct email id.<li></li></ul>"
        );
        temp = true;
      }
    }

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (temp == true) {
      return false;
    } else {
      return true;
    }
  };
});
app.controller("fpsCtrl", function ($scope, $location, $http) {
  $.post("/getProductList", { collection: "fps" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#fps").html(
        decodeURIComponent(data[0].product_text).replace(/(?:&nbsp;)/g, " ")
      );
    });
  });
});
app.controller("mtsCtrl", function ($scope, $location, $http) {
  $.post("/getProductList", { collection: "mts" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#mts").html(
        decodeURIComponent(data[0].product_text).replace(/(?:&nbsp;)/g, " ")
      );
    });
  });
});
app.controller("pmsCtrl", function ($scope, $location, $http) {
  $.post("/getProductList", { collection: "pms" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#pms").html(
        decodeURIComponent(data[0].product_text).replace(/(?:&nbsp;)/g, " ")
      );
    });
  });
});
app.controller("busCtrl", function ($scope, $location, $http) {
  $.post("/getProductList", { collection: "bus" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#bus").html(
        decodeURIComponent(data[0].product_text).replace(/(?:&nbsp;)/g, " ")
      );
    });
  });
});
app.controller("besCtrl", function ($scope, $location, $http) {
  $.post("/getProductList", { collection: "bes" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#bes").html(
        decodeURIComponent(data[0].product_text).replace(/(?:&nbsp;)/g, " ")
      );
    });
  });
});
app.controller("faqCtrl", function ($scope, $location, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | FAQ",
    ogImage: "https://www.utility-aid.co.uk/logoUA.png",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogurl: "https://www.utility-aid.co.uk/faq/"
  };

  $.post("/getProductList", { collection: "faq" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#faq").html(
        decodeURIComponent(data[0].product_text).replace(/(?:&nbsp;)/g, " ")
      );
    });
  });
});
app.controller("HomeCtrl", function ($scope, $location, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Energy and Utilities Consultancy",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/img/home/homepage.jpg",
    ogurl: "https://www.utility-aid.co.uk/"
  };

  $.post("/getProductList", { collection: "home" }, function (data) {
    $scope.$apply(function () {
      //$scope.product_text = decodeURIComponent(data[0].product_text);
      $("#text1").html(data[0].text1);
      $("#text2").html(data[0].text2);
      $("#text3").html(data[0].text3);
      $("#text4").html(
        decodeURIComponent(data[0].text4).replace(/(?:&nbsp;)/g, " ")
      );
    });
  });
});

app.controller("QuestionController", function ($scope, $location, $http) {
  $scope.submitQuestion = function () {
    if (!$scope.validate()) {
      return false;
    } else {
      $scope.requestData = {};
      $scope.requestData.name = $scope.askname;
      $scope.requestData.phone = $scope.askphone;
      $scope.requestData.email = $scope.askemail;
      $scope.requestData.questions = $scope.askquestions;

      $http({
        url: "/sendQuestionMail",
        method: "POST",
        data: $scope.requestData,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
      }).then(
        function (response) {
          $("#questionForm").css({ display: "none" });
          $("#stage").css({ display: "block" });
        },
        function (error) { }
      );
    }
  };

  $scope.makeEmptyValidators = function () {
    $("#asknameID").html("");
    $("#askemailID").html("");
    $("#askphoneID").html("");
    $("#askquestionsID").html("");
  };

  $scope.validate = function () {
    $scope.makeEmptyValidators();
    var temp = false;
    if ($scope.askname == "" || $scope.askname == undefined) {
      $("#asknameID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.askemail == "" || $scope.askemail == undefined) {
      $("#askemailID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    } else if ($scope.askemail != "") {
      if (!validateEmail($scope.askemail)) {
        $("#askemailID").html(
          "<ul class='errorlist'>Please enter correct email id.<li></li></ul>"
        );
        temp = true;
      }
    }
    if ($scope.askphone == "" || $scope.askphone == undefined) {
      $("#askphoneID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.askquestions == "" || $scope.askquestions == undefined) {
      $("#askquestionsID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (temp == true) {
      return false;
    } else {
      return true;
    }
  };
});

app.controller("EmailCampaignController", function ($scope, $location, $http, $routeParams) {
  console.log('param', $routeParams.pardotId);
  console.log('$location', $location.$$path);
  $scope.$parent.seo = {
    ogTitle: "UA | Emails",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/img/home/homepage.jpg",
    ogurl: "https://www.utility-aid.co.uk/"
  };
  if ($location.$$path == "/success/") {
    let data = {
      pardotId: $routeParams.pardotId,
      path: "success"
    }

    console.log(data);
    $scope.sendLOA = function () {
      $http({
        url: "/getEmailByPardotId",
        method: "POST",
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
      }).then(
        function (response) {
          $http({
            url: "/sendLOAmail",
            method: "POST",
            data: {
              email: response.data[0].Email,
              ID: response.data[0].ID,
              addtocall: response.data[0].addtocall ? response.data[0].addtocall : false
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8"
          }).then(
            function (response) {
              console.log(response);
            },
            function (error) {
              console.log(error);
            }
          );
        },
        function (error) {
          console.log(error);
        }
      );
    }

    $scope.sendLOA();
  }

  if ($location.$$path == "/sendloa/") {
    let data = {
      pardotId: $routeParams.pardotId,
      path: "sendloa"
    }

    console.log(data);
    $scope.sentLOA = function () {
      $http({
        url: "/getEmailBySalesforceId",
        method: "POST",
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
      }).then(
        function (response) {
          $http({
            url: "/sendLOA",
            method: "POST",
            data: {
              email: response.data[0].email,
              salesforceId: response.data[0].salesforceId,
              sendloa: true
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8"
          }).then(
            function (response) {
              console.log(response);
            },
            function (error) {
              console.log(error);
            }
          );
        },
        function (error) {
          console.log(error);
        }
      );
    }

    $scope.sentLOA();
  }

  if ($location.$$path == "/addtocall/") {
    console.log('addtocall');
    let data = {
      pardotId: $routeParams.pardotId,
      path: "addtocall"
    }
    $scope.addtoCallList = function () {
      $http({
        url: "/getEmailByPardotId",
        method: "POST",
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
      }).then(
        function (response) {
          $http({
            url: "/changeAddtoCallStatusPardotEmail",
            method: "POST",
            data: {
              email: response.data[0].Email,
              ID: response.data[0].ID,
              loasent: response.data[0].loasent ? response.data[0].loasent : false
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8"
          }).then(
            function (response) {
              console.log(response);
            },
            function (error) {
              console.log(error);
            }
          );
        },
        function (error) {
          console.log(error);
        }
      );
    }
    $scope.addtoCallList();
  }

})

app.controller("WorkWithUsController", function ($scope, $location, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | Work With US",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/img/home/homepage.jpg",
    ogurl: "https://www.utility-aid.co.uk/"
  };
  $scope.showFormModal = function () {
    $("#cvModal").modal("show");
  };

  $scope.submitJobApplication = function () {
    if (!$scope.validate()) {
      return false;
    } else {
      $(".fa-spinner").show();
      var data = {
        name: $scope.cvname,
        cvemail: $scope.cvemail,
        cvpath: $("#cvpathid").val(),
        cvname: $("#cvname").val(),
        location: $("#position").html()
      };
      console.log("data", data);
      $http({
        url: "/sendCV",
        method: "POST",
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
      }).then(
        function (response) {
          $("#cvModal").modal("hide");
          $("#successModal").modal("show");
          $(".fa-spinner").hide();
        },
        function (error) { }
      );
    }
  };
  $scope.makeEmptyValidators = function () {
    $("#cvnameId").html("");
    $("#cvemailID").html("");
    $("#cvAttachment").html("");
  };

  $scope.validate = function () {
    $scope.makeEmptyValidators();
    var temp = false;
    if (!$scope.cvname) {
      $("#cvnameID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }
    if ($scope.cvemail == "" || $scope.cvemail == undefined) {
      $("#cvemailID").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    } else if ($scope.cvemail != "") {
      if (!validateEmail($scope.cvemail)) {
        $("#cvemailID").html(
          "<ul class='errorlist'>Please enter correct email id.<li></li></ul>"
        );
        temp = true;
      }
    }
    if (!$("#cvpathid").val()) {
      $("#cvAttachment").html(
        "<ul class='errorlist'>This field is required.<li></li></ul>"
      );
      temp = true;
    }

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (temp == true) {
      return false;
    } else {
      return true;
    }
  };
});

app.controller("LOAUploadController", function ($scope, $http) {
  $scope.$parent.seo = {
    ogTitle: "UA | LOA Upload",
    ogDescripton:
      "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
    ogImage: "https://www.utility-aid.co.uk/logoUA.png",
    ogurl: "https://www.utility-aid.co.uk/"
  };

  $scope.submitLOA = function () {
    if (!$scope.validate()) {
      return false;
    } else {
      $(".fa-spinner").show();
      var data = {
        name: $scope.name,
        cvemail: $scope.cvemail,
        cvpath: $("#cvpathid").val(),
        location: $("#position").html()
      };
      console.log("data", data);
      $http({
        url: "/saveLOA",
        method: "POST",
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
      }).then(
        function (response) {
          $("#stage").show();
          $("#questionForm").hide();
          $(".fa-spinner").hide();
        },
        function (error) {
          alert("something went wrong. Please try again.")
        }
      );
    }
  };

  $scope.makeEmptyValidators = function () {
    $("#cvnameId").html("");
    $("#cvemailID").html("");
    $("#cvAttachment").html("");
  };

  $scope.validate = function () {
    $scope.makeEmptyValidators();
    var temp = false;
    if (!$scope.name) {
      $("#cvnameID").html(
        "<ul class='errorlist'>This field is required.</ul>"
      );
      temp = true;
    }
    if ($scope.cvemail == "" || $scope.cvemail == undefined) {
      $("#cvemailID").html(
        "<ul class='errorlist'>This field is required.</ul>"
      );
      temp = true;
    } else if ($scope.cvemail != "") {
      if (!validateEmail($scope.cvemail)) {
        $("#cvemailID").html(
          "<ul class='errorlist'>Please enter correct email id.</ul>"
        );
        temp = true;
      }
    }
    if (!$("#cvpathid").val()) {
      $("#cvAttachment").html(
        "<ul class='errorlist'>This field is required.</ul>"
      );
      temp = true;
    }

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (temp == true) {
      return false;
    } else {
      return true;
    }
  };

});

app.directive("emitLastRepeaterElement", function () {
  return function (scope) {
    if (scope.$last) {
      scope.$emit("LastRepeaterElement");
    }
  };
});
app.filter("to_trusted", [
  "$sce",
  function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    };
  }
]);

app.directive("bnLazySrc", function ($window, $document) {
  var lazyLoader = (function () {
    var images = [];

    var renderTimer = null;
    var renderDelay = 100;

    var win = $($window);

    var doc = $document;
    var documentHeight = doc.height();
    var documentTimer = null;
    var documentDelay = 2000;

    var isWatchingWindow = false;

    function addImage(image) {
      images.push(image);
      if (!renderTimer) {
        startRenderTimer();
      }
      if (!isWatchingWindow) {
        startWatchingWindow();
      }
    }

    function removeImage(image) {
      for (var i = 0; i < images.length; i++) {
        if (images[i] === image) {
          images.splice(i, 1);
          break;
        }
      }

      if (!images.length) {
        clearRenderTimer();
        stopWatchingWindow();
      }
    }

    function checkDocumentHeight() {
      if (renderTimer) {
        return;
      }
      var currentDocumentHeight = doc.height();

      if (currentDocumentHeight === documentHeight) {
        return;
      }

      documentHeight = currentDocumentHeight;
      startRenderTimer();
    }

    function checkImages() {
      var visible = [];
      var hidden = [];

      var windowHeight = win.height();
      var scrollTop = win.scrollTop();

      var topFoldOffset = scrollTop;
      var bottomFoldOffset = topFoldOffset + windowHeight;

      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
          visible.push(image);
        } else {
          hidden.push(image);
        }
      }

      for (var i = 0; i < visible.length; i++) {
        visible[i].render();
      }

      images = hidden;

      clearRenderTimer();

      if (!images.length) {
        stopWatchingWindow();
      }
    }

    function clearRenderTimer() {
      clearTimeout(renderTimer);
      renderTimer = null;
    }

    function startRenderTimer() {
      renderTimer = setTimeout(checkImages, renderDelay);
    }

    function startWatchingWindow() {
      isWatchingWindow = true;

      win.on("resize.bnLazySrc", windowChanged);
      win.on("scroll.bnLazySrc", windowChanged);

      documentTimer = setInterval(checkDocumentHeight, documentDelay);
    }

    function stopWatchingWindow() {
      isWatchingWindow = false;

      win.off("resize.bnLazySrc");
      win.off("scroll.bnLazySrc");

      clearInterval(documentTimer);
    }

    function windowChanged() {
      if (!renderTimer) {
        startRenderTimer();
      }
    }

    return {
      addImage: addImage,
      removeImage: removeImage
    };
  })();

  function LazyImage(element) {
    var source = null;

    var isRendered = false;

    var height = null;

    function isVisible(topFoldOffset, bottomFoldOffset) {
      if (!element.is(":visible")) {
        return false;
      }

      if (height === null) {
        height = element.height();
      }

      var top = element.offset().top;
      var bottom = top + height;

      return (
        (top <= bottomFoldOffset && top >= topFoldOffset) ||
        (bottom <= bottomFoldOffset && bottom >= topFoldOffset) ||
        (top <= topFoldOffset && bottom >= bottomFoldOffset)
      );
    }

    function render() {
      isRendered = true;
      renderSource();
    }

    function setSource(newSource) {
      source = newSource;
      if (isRendered) {
        renderSource();
      }
    }

    function renderSource() {
      element[0].src = source;
    }

    return {
      isVisible: isVisible,
      render: render,
      setSource: setSource
    };
  }

  function link($scope, element, attributes) {
    var lazyImage = new LazyImage(element);

    lazyLoader.addImage(lazyImage);

    attributes.$observe("bnLazySrc", function (newSource) {
      lazyImage.setSource(newSource);
    });

    $scope.$on("$destroy", function () {
      lazyLoader.removeImage(lazyImage);
    });
  }

  return {
    link: link,
    restrict: "A"
  };
});
