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
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/about-admin', {
            templateUrl: 'adminViews/about-admin.html'
        })
        .when('/add-author-admin', {
            templateUrl: 'adminViews/add-author-admin.html'
        })
        .when('/add-blog-admin', {
            templateUrl: 'adminViews/add-blog-admin.html'
        })
        .when('/add-casestudy-admin', {
            templateUrl: 'adminViews/add-casestudy-admin.html'

        })
        .when('/add-partner-admin', {
            templateUrl: 'adminViews/add-partner-admin.html'
        })
        .when('/add-people-admin', {
            templateUrl: 'adminViews/add-people-admin.html'
        })
        .when('/admin', {
            templateUrl: 'adminViews/admin.html'
        })
        .when('/default-admin', {
            templateUrl: 'adminViews/default-admin.html'
        })
        .when('/edit-author-admin', {
            templateUrl: 'adminViews/edit-author-admin.html'
        })
        .when('/edit-blog-admin', {
            templateUrl: 'adminViews/edit-blog-admin.html'
        })
        .when('/edit-casestudy-admin', {
            templateUrl: 'adminViews/edit-casestudy-admin.html'
        })
        .when('/edit-partner-admin', {
            templateUrl: 'adminViews/edit-partner-admin.html'
        })
        .when('/edit-people-admin', {
            templateUrl: 'adminViews/edit-people-admin.html'
        })
        .when('/home-admin', {
            templateUrl: 'adminViews/home-admin.html'
        })
        .when('/image-author-admin', {
            templateUrl: 'adminViews/image-author-admin.html'
        })
        .when('/image-background-admin', {
            templateUrl: 'adminViews/image-background-admin.html'
        })
        .when('/image-blog-admin', {
            templateUrl: 'adminViews/image-blog-admin.html'
        })
        .when('/image-partner-admin', {
            templateUrl: 'adminViews/image-partner-admin.html'
        })
        .when('/image-people-admin', {
            templateUrl: 'adminViews/image-people-admin.html'
        })
        .when('/list-authors-admin', {
            templateUrl: 'adminViews/list-authors-admin.html'
        })
        .when('/list-blogs-admin', {
            templateUrl: 'adminViews/list-blogs-admin.html'
        })
        .when('/list-casestudies-admin', {
            templateUrl: 'adminViews/list-casestudies-admin.html'
        })
        .when('/list-pages-admin', {
            templateUrl: 'adminViews/list-pages-admin.html'
        })
        .when('/list-partners-admin', {
            templateUrl: 'adminViews/list-partners-admin.html'
        })
        .when('/list-people-admin', {
            templateUrl: 'adminViews/list-people-admin.html'
        })


        .otherwise({
            redirectTo: '/admin'
        });
}).
    run(function ($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            /*if ($rootScope.loggedInUser == null) {
             // no logged user, redirect to /login
             if ( next.templateUrl === "partials/login.html") {
             } else {
             $location.path("/login");
             }
             }*/
        });
    });





