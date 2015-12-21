angular.module('myApp')
    .controller('HomeController', function ($scope, $location, $localStorage, $http) {
        $scope.getData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;

                    $scope.meta_data_meta_description = data.meta_data_meta_description;
                    $scope.meta_data_meta_title = data.meta_data_meta_title;
                    $scope.page_content_banner_text = data.page_content_banner_text;
                    $scope.page_content_story_button_link = data.page_content_story_button_link;
                    $scope.page_content_story_button_text = data.page_content_story_button_text;
                    $scope.image1 = data.image1;

                    $scope.slug = data.slug;
                    $scope.title = data.title;

                    $scope.$parent.seo = {
                        pageTitle: data.meta_data_meta_title,
                        pageDescripton: data.meta_data_meta_description,
                        ogTitle: data.meta_data_meta_title,
                        ogDescripton: data.meta_data_meta_description,
                        ogImage: 'http://www.utility-aid.co.uk/img/blog/share.jpg'
                    };

                })
                .error(function (data, status) {

                })
        }
        $scope.getCaseStudyData = function () {
            $http({
                method: 'GET',
                url: '/getCaseStudiesLastOne'
            })
                .success(function (data, status) {
                    $scope.image2 = data.image1;
                    $scope.home_page_feature_title = data.home_page_feature_title;
                    $scope.home_page_ua_action = data.home_page_ua_action;
                    $scope.home_page_case_study_button_text = data.home_page_case_study_button_text;
                    $scope.slug2 = data.slug;
                })
                .error(function (data, status) {

                })
        }
        $scope.getData();
        $scope.getCaseStudyData();

    })
    .controller('AboutController', function ($scope, $location, $localStorage, $http) {

        $scope.getData = function () {
            $http({
                method: 'GET',
                url: '/getAboutDetails'
            })
                .success(function (data, status) {
                    $scope.$parent.seo = {
                        pageTitle: data.meta_data_meta_title,
                        pageDescripton: data.meta_data_meta_description,
                        ogTitle: data.meta_data_meta_title,
                        ogDescripton: data.meta_data_meta_description,
                        ogImage: 'http://www.utility-aid.co.uk/img/blog/share.jpg'
                    };


                    $scope.People = [];
                    if (Array.isArray(data.people)) {
                        for (var k = 0; k < data.people.length; k++) {
                            $http({
                                url: "/getPeopleDetails",
                                method: "POST",
                                data: '{"objectId":"' + data.people[k] + '"}',
                                dataType: "json",
                                contentType: "application/json; charset=utf-8"
                            }).success(function (response) {
                                $scope.People.push(response);
                            });
                        }
                    }
                    else {
                        $http({
                            url: "/getPeopleDetails",
                            method: "POST",
                            data: '{"objectId":"' + data.people + '"}',
                            dataType: "json",
                            contentType: "application/json; charset=utf-8"

                        }).success(function (response) {
                            $scope.People.push(response);
                        });
                    }


                    $scope.image1 = data.image1;
                    $scope.banner_title = data.banner_title;
                    $scope.block_1_title = data.block_1_title;
                    $scope.block_1_col_1_title = data.block_1_col_1_title;
                    $scope.editor1 = data.editor1;
                    $scope.block_1_col_2_title = data.block_1_col_2_title;
                    $scope.editor2 = data.editor2;
                    $scope.block_1_col_3_title = data.block_1_col_3_title;
                    $scope.editor3 = data.editor3;
                    $scope.people_title = data.people_title;
                })

                .error(function (data, status) {

                })
        }
        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;


                })
                .error(function (data, status) {

                })
        }
        $scope.getData();
        $scope.getContactData();

        $scope.$on('LastRepeaterElement', function () {
            CreateSlide();
        });

    })
    .controller('PartnerController', function ($scope, $location, $localStorage, $http) {

        $scope.getData = function () {

            $http({
                method: 'GET',
                url: '/getActivePartnersList'
            })
                .success(function (data, status) {
                    $scope.$parent.seo = {
                        pageTitle: 'UA | Partners',
                        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
                        ogTitle: 'UA | Partners',
                        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
                        ogImage: 'http://www.utility-aid.co.uk/img/blog/share.jpg'
                    };


                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        if (i == 0) {
                            html += '<div class="row">'
                        }
                        if (i % 4 == 0 && i != 0) {
                            html += '</div><div class="row">'
                        }
                        html += ' <div class="col-md-3"><a href="' + data[i].link + '" target="_blank"> <img src="' + data[i].image1 + '" title="' + data[i].partner_name + '" alt="' + data[i].partner_name + '"> <span>' + data[i].partner_name + '</span> </a></div>';
                    }
                    $("#partnerList").append(html + "</div>");
                })

                .error(function (data, status) {


                })
        }
        $scope.getContactData = function () {

            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;


                })
                .error(function (data, status) {


                })
        }
        $scope.getData();
        $scope.getContactData();

    })
    .controller('CaseStudiesController', function ($scope, $location, $localStorage, $http) {

        $scope.CaseStudies = [];
        $scope.getData = function () {
            $http({
                method: 'GET',
                url: '/getActiveCaseStudiesList'
            })
                .success(function (data, status) {

                    $scope.$parent.seo = {
                        pageTitle: 'UA | Case Studies',
                        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
                        ogTitle: 'UA | Case Studies',
                        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
                        ogImage: 'http://www.utility-aid.co.uk/img/blog/share.jpg'
                    };

                    $scope.CaseStudies = data;


                })

                .error(function (data, status) {


                })
        }
        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;


                })
                .error(function (data, status) {


                })
        }
        $scope.getData();

        $scope.$on('LastRepeaterElement', function () {
            $scope.getContactData();
            CreateMsnry();
        });

    })
    .controller('CaseStudiesDetailsController', function ($scope, $location, $localStorage, $http) {
        $scope.CaseStudiesDetails = [];
        $scope.getData = function () {
            var url = window.location.toString();
            var parts = url.split("/");
            var slug = "";
            if (parts[parts.length - 1] = "") {
                slug = parts[parts.length - 1];
            } else {
                slug = parts[parts.length - 2]
            }
            var formdata = {"slug": "" + slug + ""};
            $http({
                url: "/getCaseStudiesDetailsBySlug",
                method: "POST",
                data: formdata,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .success(function (data, status) {
                    if (data.status == 'error') {
                        window.location = "/";
                    }

                    $scope.CaseStudiesDetails.push(data);

                    $scope.$parent.seo = {
                        pageTitle: 'UA | ' + data.title,
                        pageDescripton: data.meta_data_meta_description,
                        ogTitle: data.meta_data_meta_title,
                        ogDescripton: data.meta_data_meta_description,
                        ogImage: 'http://www.utility-aid.co.uk/' + data.thumbImage
                    };
                    var value = data.editor1;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor1 = value;
                    var value = data.editor2;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor2 = value;
                    var value = data.editor3;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor3 = value;
                    var value = data.editor4;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor4 = value;
                    var value = data.editor5;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor5 = value;
                    var value = data.editor6;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor6 = value;
                    var value = data.editor7;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor7 = value;
                    var value = data.editor8;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor8 = value;
                    var value = data.editor9;
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor9 = value;
                })
                .error(function (data, status) {

                })
        }
        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;

                })
                .error(function (data, status) {

                })
        }
        $scope.getData();
        $scope.getContactData();

        $scope.$on('LastRepeaterElement', function () {

        });
    })
    .controller('BlogController', function ($scope, $location, $localStorage, $http) {
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
        $scope.Blogs = [];
        $scope.getData = function () {
            $http({
                method: 'GET',
                url: '/getActiveBlogList'
            })
                .success(function (data, status) {
                    $scope.$parent.seo = {
                        pageTitle: 'UA | Blog',
                        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
                        ogTitle: 'UA | Blog',
                        ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
                        ogImage: 'http://www.utility-aid.co.uk/img/blog/share.jpg'
                    };
                    $scope.Blogs = data;


                })

                .error(function (data, status) {

                })
        }
        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;

                })
                .error(function (data, status) {

                })
        }
        $scope.getData();
        $scope.getContactData();
        $scope.$on('LastRepeaterElement', function () {
            CreateMsnry();
        });

    })
    .controller('ArticleController', function ($scope, $location, $localStorage, $http) {
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
        $scope.getData = function () {
            var url = window.location.toString();
            var parts = url.split("/");
            var slug = "";
            if (parts[parts.length - 1] = "") {
                slug = parts[parts.length - 1];
            } else {
                slug = parts[parts.length - 2]
            }
            var formdata = {"slug": "" + slug + ""};
            $http({
                url: "/getArticleDetails",
                method: "POST",
                data: formdata,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .success(function (data, status) {
                    if (data.status == 'error') {
                        window.location = "/";
                    }
                    $scope.$parent.seo = {
                        pageTitle: 'UA | ' + data.title,
                        pageDescripton: data.meta_data_meta_description,
                        ogTitle: data.meta_data_meta_title,
                        ogDescripton: data.meta_data_meta_description,
                        ogImage: 'http://www.utility-aid.co.uk/' + data.thumbImage
                    };

//get author list
                    $scope.Author = [];
                    if (Array.isArray(data.author)) {
                        for (var k = 0; k < data.author.length; k++) {
                            $http({
                                url: "/getAuthorDetails",
                                method: "POST",
                                data: '{"objectId":"' + data.author[k] + '"}',
                                dataType: "json",
                                contentType: "application/json; charset=utf-8"
                            }).success(function (response) {
                                    $scope.Author.push(response);
                                }
                            );
                        }
                    }
                    else {
                        $http({
                            url: "/getAuthorDetails",
                            method: "POST",
                            data: '{"objectId":"' + data.author + '"}',
                            dataType: "json",
                            contentType: "application/json; charset=utf-8"
                        }).success(function (response) {
                                console.log(response);
                                $scope.Author.push(response);
                            }
                        );
                    }
//get latest articles
                    $scope.Article = [];
                    $.get("/getBlogList", function (article) {
                        $scope.Article = article.slice(0, 3);
                        for (var k = 0; k < $scope.Article.length; k++) {

                            if ($scope.Article[k].slug == slug) {
                                $scope.Article.splice(k, 1);
                            }
                        }
                    });


                    $scope.image1 = data.image1;
                    $scope.page_content_extended_title = data.page_content_extended_title;
                    //    $scope.publish_date_0 = data.publish_date_0;
                    var dateString = data.publish_date_0;
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

                    var value = data.editor1;
                    value = value.replace(/font-family: Arial, Helvetica, Verdana, Tahoma, sans-serif; font-size: 15px; line-height: 22.5px; border: none; box-shadow: none; background: none;/g, 'border:none');
                    value = value.replace(/&nbsp;/g, ' ');
                    $scope.editor1 = value;

                })

                .error(function (data, status) {

                })
        }
        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;

                })
                .error(function (data, status) {

                })
        }
        $scope.getData();
        $scope.getContactData();

        $scope.$on('LastRepeaterElement', function () {


            //   CreateSlide();
        });

    })
    .controller('RequestController', function ($scope, $location, $localStorage, $http) {
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


        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;

                })
                .error(function (data, status) {

                })
        }
        $scope.getContactData();
    })
    .controller('DefaultController', function ($scope, $location, $localStorage, $http) {
        $scope.getData = function () {
            var url = window.location.toString();
            var parts = url.split("/");
            var slug = "";
            if (parts[parts.length - 1] = "") {
                slug = parts[parts.length - 1];
            } else {
                slug = parts[parts.length - 2]
            }
            var formdata = {"slug": "" + slug + ""};
            $http({
                url: "/getDefaultDetailsBySlug",
                method: "POST",
                data: formdata,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
                .success(function (data, status) {
                    $scope.editor1 = data.editor;
                    $scope.$parent.seo = {
                        pageTitle: 'UA | ' + data.title,
                        pageDescripton: data.meta_data_meta_description,
                        ogTitle: data.meta_data_meta_title,
                        ogDescripton: data.meta_data_meta_description
                    };
                })
                .error(function (data, status) {

                })
        }
        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;

                })
                .error(function (data, status) {

                })
        }
        $scope.getData();
        $scope.getContactData();
    })
    .controller('ThankYouController', function ($scope, $location, $localStorage, $http) {
        $scope.$parent.seo = {
            pageTitle: 'UA | ThankYou',
            pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy.",
            ogTitle: 'UA | ThankYou',
            ogDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
        };


        $scope.getContactData = function () {
            $http({
                method: 'GET',
                url: '/getHomepageText'
            })
                .success(function (data, status) {
                    $scope.contact_birmingham_find_url = data.contact_birmingham_find_url;
                    $scope.contact_email = data.contact_email;
                    $scope.contact_email_text = data.contact_email_text;
                    $scope.contact_facebook_text = data.contact_facebook_text;
                    $scope.contact_facebook_url = data.contact_facebook_url;
                    $scope.contact_freephone = data.contact_freephone;
                    $scope.contact_glasgow_find_url = data.contact_glasgow_find_url;
                    $scope.contact_sales_phone = data.contact_sales_phone;
                    $scope.contact_sleaford_find_url = data.contact_sleaford_find_url;
                    $scope.contact_twitter_text = data.contact_twitter_text;
                    $scope.contact_twitter_url = data.contact_twitter_url;

                    $scope.request_button_link = data.request_button_link;
                    $scope.request_button_text = data.request_button_text;
                    $scope.request_title = data.request_title;

                })
                .error(function (data, status) {

                })
        }
        $scope.getContactData();
    })


