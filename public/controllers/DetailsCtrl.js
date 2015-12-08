/**
 * Created by Surendra on 26/06/2015.
 */
angular.module('myApp')
    .controller('DetailsCtrl', function ($scope, $location,$localStorage, $http) {
        var that = this;
        that.APP_HEADERS = {
            'X-Parse-Application-Id': '4dogMi1fkrsQHpQkKyvJZT8rzP2fL0qcgZ3W5W1F',
            'X-Parse-REST-API-Key': 'HlxHCafkyFLaQGsc1LgpiJU0aZrvtuKiLsAqQC5Y'
        };

        that.URL = "https://api.parse.com/1/classes/";

        $scope.items = [];
        $scope.getCustomerList = function () {
            if($localStorage.session =="" || $localStorage.session==undefined)
            {
                $location.path('/login');
            }
            console.log($localStorage.session);
            $('.loading-indicator-modal').show();
            $http({
                method: 'GET',
                url: that.URL + 'CBH',
                headers: that.APP_HEADERS
            })
                .success(function (data, status) {
                    $scope.items=data;
                    console.log(data);
                    $('.loading-indicator-modal').hide();
                })
                .error(function (data, status) {
                    $('.loading-indicator-modal').hide();

                })
        }
        $scope.getCustomerList();
        //shows Loader for Modal
        $scope.showMLoader = function () {
            $('.loding-indicator-modal').css('display', 'inline-block');
        }
        //hide Loader for Modal
        $scope.hideMLoader = function () {
            $('.loding-indicator-modal').css('display', 'none');
        }
        $scope.logOut = function () {
            $localStorage.session='';
            $location.path('/login');
            console.log($localStorage.session);
            debugger;
        }
    });
