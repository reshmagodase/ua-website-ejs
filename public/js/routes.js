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
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/home/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })

        .when('/why-ua/', {
            templateUrl: 'views/why-ua.html',
            controller: 'whyuaController'
        })
        .when('/blog/', {
            templateUrl: 'views/why-ua.html',
            controller: 'whyuaController'
        })
        .when('/our-products/', {
            templateUrl: 'views/our-products.html',
            controller: 'ourproductsController'
        })
        .when('/our-clients-say/', {
            templateUrl: 'views/our-clients-say.html',
            controller: 'ourclientssayController'
        })
        .when('/advisory-board/', {
            templateUrl: 'views/advisory-board.html',
            controller: 'advisoryboardController'
        })
        .when('/about/', {
            templateUrl: 'views/advisory-board.html',
            controller: 'advisoryboardController'
        })
        .when('/faq/', {
            templateUrl: 'views/faq.html',
            controller: 'faqCtrl'
        })
        .when('/contact/', {
            templateUrl: 'views/contact.html',
            controller: 'contactController'
        })
        .when('/bribery-act-statement/', {
            templateUrl: 'views/bribery-act-statement.html',
            controller: 'DefaultController'
        })
        .when('/environmental-policy/', {
            templateUrl: 'views/environmental-policy.html',
            controller: 'DefaultController'
        })
        .when('/privacy-policy/', {
            templateUrl: 'views/privacy-policy.html',
            controller: 'DefaultController'
        })
        .when('/case-studies/:group*', {
            templateUrl: 'views/case-studies/case-study.html',
            controller: 'CaseStudiesDetailsController'
        })
        .when('/blog/:group*', {
            templateUrl: 'views/blog/articles.html',
            controller: 'BlogDetailsController'
        })
        .when('/request/', {
            templateUrl: 'views/request.html',
            controller: 'RequestController'
        })
        .when('/thankyou/', {
            templateUrl: 'views/thankyou.html',
            controller: 'DefaultController'
        })
        .when('/thank-you/', {
            templateUrl: 'views/thank-you.html',
            controller: 'DefaultController'
        })
        .otherwise({
            redirectTo: '/'
        });

});

app.controller('DefaultController', function ($scope, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | Energy and Utilities Consultancy",
        ogTitle: "UA | Energy and Utilities Consultancy",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
})
app.controller('whyuaController', function ($scope, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | Why UA?",
        ogTitle: "UA | Why UA?",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
})
/*app.controller('blogController', function ($scope, $http) {
 $scope.$parent.seo = {
 pageTitle: "UA | Blogs",
 ogTitle: "UA | Blogs",
 pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
 ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
 };
 })*/
app.controller('ourproductsController', function ($scope, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | Our Products",
        ogTitle: "UA | Our Products",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
})
app.controller('ourclientssayController', function ($scope, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | Our Clients Say",
        ogTitle: "UA | Our Clients Say",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
})
app.controller('advisoryboardController', function ($scope, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | Advisory Board",
        ogTitle: "UA | Advisory Board",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
    $.post("/getProductList", {"collection": "advisory"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#titletext").html(data[0].titletext);
            $("#person1").html(data[0].person1);
            $("#person2").html(data[0].person2);
            $("#person3").html(data[0].person3);
            $("#person1_description").html(data[0].person1_description);
            $("#person2_description").html(data[0].person2_description);
            $("#person3_description").html(data[0].person3_description);

        });
    });
})

app.controller('contactController', function ($scope, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | Contact",
        ogTitle: "UA | Contact",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
    $.post("/getProductList", {"collection": "contact"}, function (data) {
        $scope.$apply(function () {
            $scope.items = data;
        });
    });
})
app.controller('CaseStudiesController', function ($scope, $http) {
    $scope.CaseStudies = [];
    $.post("/getCaseStudyList", {"active": "on"}, function (data) {
        $scope.$apply(function () {
            $scope.CaseStudies = data;
        });
    });
})
app.controller('PartnersController', function ($scope, $http) {

    $scope.Partners = [];
    $.post("/getPartnerList", {"active": "on"}, function (data) {
        $scope.$apply(function () {
            $scope.Partners = data;
        });
    });

})
app.controller('BlogsController', function ($scope, $http) {
    $scope.formatDate = function (date) {
        var dateString = date;
        var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var dateArray = reggie.exec(dateString);
        var dateObject = new Date(
            (+dateArray[1]),
            (+dateArray[2]) - 1, // Careful, month starts at 0!
            (+dateArray[3]),
            (+dateArray[4]),
            (+dateArray[5]),
            (+dateArray[6])
        );

        return dateObject;
    };

    $.post("/getBlogList", {"active": "on"}, function (data) {
        $scope.$apply(function () {
            $scope.Blogs = data;
        });
    });

})
app.controller('CaseStudiesDetailsController', function ($scope, $location, $http) {
    var url = window.location.toString();
    var parts = url.split("/");
    var slug = "";
    if (parts[parts.length - 1] = "") {
        slug = parts[parts.length - 1];
    } else {
        slug = parts[parts.length - 2]
    }
    $.post("/getCaseStudyList", {"slug": slug}, function (data) {

        $scope.$apply(function () {

            $scope.$parent.seo = {
                pageTitle: 'UA | ' + data[0].title,
                pageDescripton: data[0].meta_data_meta_description,
                ogTitle: data[0].meta_data_meta_title,
                ogDescripton: data[0].meta_data_meta_description,
                ogImage: 'http://www.utility-aid.co.uk/' + data[0].thumbImage
            };


            $scope.banner_col_1_title = data[0].banner_col_1_title;
            $scope.banner_col_1_text = data[0].banner_col_1_text;
            $scope.banner_col_2_title = data[0].banner_col_2_title;
            $scope.banner_col_2_text = data[0].banner_col_2_text;
            $scope.banner_col_3_title = data[0].banner_col_3_title;
            $scope.banner_col_3_text = data[0].banner_col_3_text;
            $scope.banner_title = data[0].banner_title;


            $scope.block_1_title = data[0].block_1_title;
            $scope.block_1_sub_title = data[0].block_1_sub_title;
            $scope.block_1_col_1_title = data[0].block_1_col_1_title;
            $scope.block_1_col_2_title = data[0].block_1_col_2_title;
            $scope.block_1_col_3_title = data[0].block_1_col_3_title;


            $scope.block_2_quote = data[0].block_2_quote;
            $scope.block_2_author = data[0].block_2_author;
            $scope.block_2_city = data[0].block_2_city;


            $scope.block_3_title = data[0].block_3_title;
            $scope.block_3_sub_title = data[0].block_3_sub_title;
            $scope.block_3_col_1_title = data[0].block_3_col_1_title;
            $scope.block_3_col_2_title = data[0].block_3_col_2_title;
            $scope.block_3_col_3_title = data[0].block_3_col_3_title;


            $scope.block_4_quote = data[0].block_4_quote;
            $scope.block_4_author = data[0].block_4_author;
            $scope.block_4_city = data[0].block_4_city;

            $scope.block_5_title = data[0].block_5_title;
            $scope.block_5_sub_title = data[0].block_5_sub_title;
            $scope.block_5_col_1_title = data[0].block_5_col_1_title;
            $scope.block_5_col_2_title = data[0].block_5_col_2_title;
            $scope.block_5_col_3_title = data[0].block_5_col_3_title;

            $scope.image1 = data[0].image1;
            $scope.image2 = data[0].image2;
            $scope.image3 = data[0].image3;


            var value = data[0].editor1;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor1 = value;
            var value = data[0].editor2;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor2 = value;
            var value = data[0].editor3;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor3 = value;
            var value = data[0].editor4;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor4 = value;
            var value = data[0].editor5;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor5 = value;
            var value = data[0].editor6;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor6 = value;
            var value = data[0].editor7;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor7 = value;
            var value = data[0].editor8;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor8 = value;
            var value = data[0].editor9;
            value = value.replace(/&nbsp;/g, ' ');
            $scope.editor9 = value;
        });
    });
})
app.controller('BlogDetailsController', function ($scope, $location, $localStorage, $http) {
    $scope.formatDate = function (date) {
        var dateString = date;
        var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var dateArray = reggie.exec(dateString);
        var dateObject = new Date(
            (+dateArray[1]),
            (+dateArray[2]) - 1, // Careful, month starts at 0!
            (+dateArray[3]),
            (+dateArray[4]),
            (+dateArray[5]),
            (+dateArray[6])
        );

        return dateObject;
    };

    var url = window.location.toString();
    var parts = url.split("/");
    var slug = "";
    if (parts[parts.length - 1] = "") {
        slug = parts[parts.length - 1];
    } else {
        slug = parts[parts.length - 2]
    }

    $.post("/getBlogList", {"slug": slug}, function (data) {
        $scope.$apply(function () {
            $scope.$parent.seo = {
                pageTitle: 'UA | ' + data[0].title,
                pageDescripton: data[0].meta_data_meta_description,
                ogTitle: data[0].meta_data_meta_title,
                ogDescripton: data[0].meta_data_meta_description,
                ogImage: 'http://www.utility-aid.co.uk/' + data[0].thumbImage
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
                    }).success(function (response) {

                            for (var j = 0; j < response.length; j++) {
                                if (response[j]._id == authorList[k]) {
                                    $scope.Author.push(response[j]);

                                }
                            }
                        }
                    );
                }
            }
            else {
                $http({
                    url: "/getAuthorList",
                    method: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                }).success(function (response) {
                        console.log(response);
                        for (var j = 0; j < response.length; j++) {
                            if (response[j]._id == authorList) {
                                $scope.Author.push(response[j]);

                            }
                        }
                    }
                );
            }


            $scope.image1 = data[0].image1;
            $scope.page_content_extended_title = data[0].page_content_extended_title;
            var dateString = data[0].publish_date_0;
            var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
            var dateArray = reggie.exec(dateString);
            var dateObject = new Date(
                (+dateArray[1]),
                (+dateArray[2]) - 1, // Careful, month starts at 0!
                (+dateArray[3]),
                (+dateArray[4]),
                (+dateArray[5]),
                (+dateArray[6])
            );
            $scope.publish_date_0 = dateObject;
            var value = data[0].editor1;
            value = value.replace(/&nbsp;/g, ' ');
            $("#editor1").html("");
            $("#editor1").append(value);
            $("#editor1").find('*').removeAttr("style");


            $("#sharer").html('<a class="facebook" href="#"></a> <a class="tweet" href="#" title="' + data[0].title + ' @UA_Energy"></a>');
            var loc = window.location.href;
            var title = data[0].meta_data_meta_title;
            var summary = data[0].meta_data_meta_description;
            var thumbImage = "http://www.utility-aid.co.uk/" + data[0].thumbImage;
            $('a.facebook').click(function (e) {
                e.preventDefault();
                FB.ui(
                    {
                        method: 'feed',
                        name: title,
                        link: loc,
                        picture: thumbImage,
                        caption: 'www.utility-aid.co.uk',
                        description: summary,
                        message: ''
                    });
            });

            var loctw = window.location.href;
            var titletw = data[0].title;
            $('a.tweet').click(function (e) {
                e.preventDefault();
                window.open('http://twitter.com/share?url=' + loctw + '&text=' + titletw, 'twitterwindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 225) + ', left=' + $(window).width() / 2 + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
            });
        });
    });
    $.post("/getBlogList", {"active": "on"}, function (data) {
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

})
app.controller('RequestController', function ($scope, $location, $http) {
    $scope.$parent.seo = {
        pageTitle: 'UA | Request your free energy consultation',
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogTitle: 'UA | Request your free energy consultation',
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
    $scope.addUser = function () {
        if (!$scope.validate()) {
            return false;
        }
        else {

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
            })
                .success(function (data, status) {

                    window.location = "/thank-you/";
                })

                .error(function (data, status) {
                })

        }

    }

    $scope.makeEmptyValidators = function () {
        $("#fullnameID").html("");
        $("#emailID").html("");
        $("#msgID").html("");
        $("#auditID").html("");
        $("#hearfromID").html("");

    }

    $scope.validate = function () {
        $scope.makeEmptyValidators();
        var temp = false;
        if ($scope.fullName == "" || $scope.fullName == undefined) {
            $("#fullnameID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            temp = true;
        }
        if ($scope.email == "" || $scope.email == undefined) {
            $("#emailID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            temp = true;
        }
        if ($scope.msg == "" || $scope.msg == undefined) {
            $("#msgID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            temp = true;
        }
        if ($scope.audit == "" || $scope.audit == undefined) {
            $("#auditID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            temp = true;
        }
        if ($scope.hearfrom == "" || $scope.hearfrom == undefined) {
            $("#hearfromID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            temp = true;
        }
        if ($scope.email != "") {
            if (!validateEmail($scope.email)) {
                $("#emailID").html("<ul class='errorlist'>Please enter correct email id.<li></li></ul>");
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
    }
})
app.controller('fpsCtrl', function ($scope, $location, $http) {
    $.post("/getProductList", {"collection": "fps"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#fps").html(decodeURIComponent(data[0].product_text));
        });
    });

});
app.controller('mtsCtrl', function ($scope, $location, $http) {
    $.post("/getProductList", {"collection": "mts"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#mts").html(decodeURIComponent(data[0].product_text));
        });
    });

});
app.controller('pmsCtrl', function ($scope, $location, $http) {
    $.post("/getProductList", {"collection": "pms"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#pms").html(decodeURIComponent(data[0].product_text));
        });
    });

});
app.controller('busCtrl', function ($scope, $location, $http) {
    $.post("/getProductList", {"collection": "bus"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#bus").html(decodeURIComponent(data[0].product_text));
        });
    });

});
app.controller('besCtrl', function ($scope, $location, $http) {
    $.post("/getProductList", {"collection": "bes"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#bes").html(decodeURIComponent(data[0].product_text));
        });
    });

});
app.controller('faqCtrl', function ($scope, $location, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | FAQ",
        ogTitle: "UA | FAQ",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
    $.post("/getProductList", {"collection": "faq"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#faq").html(decodeURIComponent(data[0].product_text));
        });
    });

});
app.controller('HomeCtrl', function ($scope, $location, $http) {
    $scope.$parent.seo = {
        pageTitle: "UA | Energy and Utilities Consultancy",
        ogTitle: "UA | Energy and Utilities Consultancy",
        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
    };
    $.post("/getProductList", {"collection": "home"}, function (data) {
        $scope.$apply(function () {
            //$scope.product_text = decodeURIComponent(data[0].product_text);
            $("#text1").html(data[0].text1);
            $("#text2").html(data[0].text2);
            $("#text3").html(data[0].text3);
            $("#text4").html(decodeURIComponent(data[0].text4));
        });
    });
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












