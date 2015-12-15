'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'ngStorage'
]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
        .when('/', {
            title: 'UA | Energy and Utilities Consultancy',
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/case-studies/', {
            title: 'UA | Case Studies',
            templateUrl: 'views/case-studies.html',
            controller: 'CaseStudiesController'
        })
        .when('/contact/', {
            title: 'UA | Case Studies',
            templateUrl: 'views/contact.html'
        })
        .when('/about/', {
            title: 'UA | About UA',
            templateUrl: 'views/about.html'
        })
        .when('/blog/', {
            title: 'UA | Blog',
            templateUrl: 'views/blog.html'
        })
        .when('/subscribe/', {
            title: 'UA | Subscribe to our newsletter',
            templateUrl: 'views/subscribe.html'
        })
        .when('/request/', {
            title: 'UA | Request your free energy consultation',
            templateUrl: 'views/request.html'
        })
        .when('/partners/', {
            title: 'UA | Partners',
            templateUrl: 'views/partners.html',
            controller: 'PartnerController'
        })
        .when('/thank-you/', {
            title: 'UA | Thank You',
            templateUrl: 'views/thank-you.html'
        })

        .when('/blog/:group*', {
            templateUrl: 'views/blog/articles.html'
        })
        .when('/case-studies/:group*', {
            templateUrl: 'views/case-studies/case-study.html'
        })

        .otherwise({
            redirectTo: '/'
        });
});
/*
app.run(['$rootScope', '$route', function ($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
    });
}]);*/











