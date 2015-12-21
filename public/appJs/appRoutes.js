'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
 //   'ngCookies',
  //  'ngResource',
    'ngRoute',
    'ngSanitize',
  //  'ui.router',
    'ngStorage'
]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/case-studies/', {
            templateUrl: 'views/case-studies.html',
            controller: 'CaseStudiesController'
        })
        .when('/contact/', {
            title: 'UA | Case Studies',
            templateUrl: 'views/contact.html'
        })
        .when('/about/', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        })
        .when('/blog/', {
            templateUrl: 'views/blog.html',
            controller: 'BlogController'
        })
        .when('/subscribe/', {
            templateUrl: 'views/subscribe.html',
            controller: 'SubscribeController'
        })
        .when('/request/', {
            templateUrl: 'views/request.html',
            controller: 'RequestController'
        })
        .when('/request/:group*', {
            templateUrl: 'views/thank-you.html',
            controller: 'ThankYouController'
        })
        .when('/partners/', {
            templateUrl: 'views/partners.html',
            controller: 'PartnerController'
        })
        .when('/blog/:group*', {
            templateUrl: 'views/blog/articles.html',
            controller: 'ArticleController'
        })
        .when('/case-studies/:group*', {
            templateUrl: 'views/case-studies/case-study.html',
            controller: 'CaseStudiesDetailsController'
        })
        .when('/privacy-policy/', {
            templateUrl: 'views/default.html',
            controller: 'DefaultController'
        })
        .when('/environmental-policy/', {
            templateUrl: 'views/default.html',
            controller: 'DefaultController'
        })
        .when('/bribery-act-statement/', {
            templateUrl: 'views/default.html',
            controller: 'DefaultController'
        })
        .otherwise({
            redirectTo: '/'
        });
}).directive('emitLastRepeaterElement', function() {
    return function(scope) {
        if (scope.$last){
            scope.$emit('LastRepeaterElement');
        }
    };
}).filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
/*
app.run(['$rootScope', '$route', function ($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
    });
}]);*/











