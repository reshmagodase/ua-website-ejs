angular.module('myApp')
    .controller('HomeController', function ($scope, $location, $localStorage, $http) {
        $scope.getData = function () {
            $('.loading-indicator-modal').show();
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
                        pageTitle: 'UA | Energy and Utilities Consultancy',
                        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
                    };

                    console.log(data);
                    $('.loading-indicator-modal').hide();
                })
                .error(function (data, status) {
                    $('.loading-indicator-modal').hide();

                })
        }
        $scope.getData();
        //shows Loader for Modal

        $scope.showMLoader = function () {
            $('.loding-indicator-modal').css('display', 'inline-block');
        }
        //hide Loader for Modal
        $scope.hideMLoader = function () {
            $('.loding-indicator-modal').css('display', 'none');
        }
        $scope.logOut = function () {
            $localStorage.session = '';
            $location.path('/login');
        }
    })
    .controller('PartnerController', function ($scope, $location, $localStorage, $http) {

        $scope.getData = function () {
            $('.loading-indicator-modal').show();
            $http({
                method: 'GET',
                url: '/getPartnersList'
            })
                .success(function (data, status) {
                    $scope.$parent.seo = {
                        pageTitle: 'UA | Partners',
                        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
                    };

                    $('.loading-indicator-modal').hide();
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
                    $('.loading-indicator-modal').hide();

                })
        }
        $scope.getContactData = function () {
            $('.loading-indicator-modal').show();
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

                    $('.loading-indicator-modal').hide();
                })
                .error(function (data, status) {
                    $('.loading-indicator-modal').hide();

                })
        }
        $scope.getData();
        $scope.getContactData();
        //shows Loader for Modal

        $scope.showMLoader = function () {
            $('.loding-indicator-modal').css('display', 'inline-block');
        }
        //hide Loader for Modal
        $scope.hideMLoader = function () {
            $('.loding-indicator-modal').css('display', 'none');
        }
        $scope.logOut = function () {
            $localStorage.session = '';
            $location.path('/login');
        }
    })
    .controller('CaseStudiesController', function ($scope, $location, $localStorage, $http) {

        $scope.CaseStudies = [];
        $scope.getData = function () {
            $('.loading-indicator-modal').show();
            $http({
                method: 'GET',
                url: '/getCaseStudiesList'
            })
                .success(function (data, status) {
                    $scope.$parent.seo = {
                        pageTitle: 'UA | Case Studies',
                        pageDescripton: "We're inspired by the organisations and people we work with. We want to help save them time and money when they source and purchase their energy."
                    };
                       $scope.CaseStudies = data;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="item"> <a class="post" href="' + data[i].slug + '"> <img class="main-pic" src="' + data[i].thumbImage + '" style="height:200px;"> <div class="info"> <h2>' + data[i].title + '</h2> <p>' + data[i].home_page_listing_excerpt + '</p> </div> </a> </div>'
                    }
                  //  $('#case-study-items').append(html).masonry('appended', html);
                    $('.loading-indicator-modal').hide();

                })

                .error(function (data, status) {
                    $('.loading-indicator-modal').hide();

                })
        }
        $scope.getContactData = function () {
            $('.loading-indicator-modal').show();
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

                    $('.loading-indicator-modal').hide();
                })
                .error(function (data, status) {
                    $('.loading-indicator-modal').hide();

                })
        }
        $scope.getData();
        $scope.getContactData();
        //shows Loader for Modal

        $scope.showMLoader = function () {
            $('.loding-indicator-modal').css('display', 'inline-block');
        }
        //hide Loader for Modal
        $scope.hideMLoader = function () {
            $('.loding-indicator-modal').css('display', 'none');
        }
        $scope.logOut = function () {
            $localStorage.session = '';
            $location.path('/login');
        }
        CreateMsnry();
    });
