/**
 * Created by Surendra on 4/17/2015.
 */
angular.module('myApp')
    .controller('LoginCtrl', function ($scope, $location,$http,$localStorage) {
        $scope.current_search_engine = '';
        $scope.engine = '';
       $scope.responce='';
        var that=this;
        that.APP_HEADERS={
            'X-Parse-Application-Id':'4dogMi1fkrsQHpQkKyvJZT8rzP2fL0qcgZ3W5W1F',
            'X-Parse-REST-API-Key':'HlxHCafkyFLaQGsc1LgpiJU0aZrvtuKiLsAqQC5Y'
        };

        $scope.getUrl = function () {
            if (window.location.protocol !== 'http:') {
                debugger;
                window.location = 'https://' + window.location.hostname + window.location.pathname + window.location.hash;
                console.log(window.location)
                console.log(window.location.hostname)
                console.log(window.location.pathname)
                console.log(window.location.hash)
            }
        }
        $scope.getUrl();
        that.URL="https://api.parse.com/1/classes/";

        $scope.searchGasEngine = function () {
            debugger;
            $location.path("/engine");
            debugger;
        }
        $scope.searchElectricityEngine = function (engine) {

            $scope.current_search_engine = "Electricity";
            var a = $scope.current_search_engine;
            console.log(a);
            debugger;
            $location.path("/engineElectricity");
            debugger;
        }
        $scope.searchGEEngine = function () {

            $scope.current_search_engine = "GE";
            var a = $scope.current_search_engine;
            console.log(a);
            debugger;
            $location.path("/engineElectricityAndGas");
            debugger;
        }
        $scope.addUser = function () {
            if (!$scope.validate()) {
                debugger;
                return;
            }
            $scope.showMLoader();
            $scope.requestData = {};
            $scope.requestData.name = $scope.name;
            $scope.requestData.emailId = $scope.emailId;
            $scope.requestData.subject = $scope.subject;
            $scope.requestData.msg = $scope.msg;
            $http({ method : 'POST',
                data:$scope.requestData,
                url : that.URL+'CBH',
                headers:that.APP_HEADERS
            })
                .success(function(data, status) {
                    $scope.hideMLoader();
                    $scope.makeEmpty();
                    $scope.responce="Your message was sent successfully. Thanks."
                    debugger;
                })
                .error(function(data, status) {
                    debugger;
                    console.log(data)
                })
        }
        $scope.makeEmpty=function(){
            debugger;
            $scope.name="";
            $scope.emailId="";
            $scope.subject="";
            $scope.msg="";
        }
        //shows Loader for Modal
        $scope.showMLoader=function(){
            $('.loding-indicator-modal').css('display','inline-block');
        }
        //hide Loader for Modal
        $scope.hideMLoader=function(){
            $('.loding-indicator-modal').css('display','none');
        }
        $scope.validate = function () {
            if ($scope.name == "" || $scope.name == undefined) {

                $("#name").html("* Please fill the required field.");
                debugger;
                return false;
            }
            if ($scope.emailId == "" || $scope.emailId == undefined) {
                $("#name").html("");
                $("#email").html("* Please fill the email field.");
                debugger;
                return false;
            }
            if ($scope.subject == "" || $scope.subject == undefined) {
                $("#name").html("");
                $("#email").html("");
                $("#subject").html("* Please fill the subject field.");
                debugger;
                return false;
            }
            if ($scope.msg == "" || $scope.msg == undefined) {
                $("#name").html("");
                $("#email").html("");
                $("#subject").html("");
                $("#msg").html("* Please fill the message field.");
                debugger;
                return false;
            }

            return true;
        }


        /*Login as a admin*/
        $scope.authUser=function(){
            if($scope.validateLogin()){
                $scope.showMLoader();

                var reqData={};
                reqData.username=$scope.username;
                reqData.password=$scope.password;

                debugger;
                $http({ method : 'POST',
                    data:reqData,
                    url : 'https://api.parse.com/1/functions/UserValidation',
                    headers:that.APP_HEADERS
                })
                    .success(function(data, status) {
                        $scope.hideMLoader();
    console.log(data.result);
                        if(data.result.className=='AppUsers'){
                            $localStorage.session=data.result.username;
                            $location.path('/details');
                        }
/*
                        $localStorage.session=data.result.username;
*/
                        $location.path('/details');
                        debugger;
                        console.log(data.result)
                    })
                    .error(function(data, status) {
                        $scope.hideMLoader();

                        debugger;
                    })

            }

        }

        $scope.validateLogin=function(){
            if($scope.username =="" || $scope.username==undefined){
                debugger
                $scope.validateMsg="Please enter Username";
                return false;
            }
            if($scope.password =="" || $scope.password==undefined){
                $scope.validateMsg="Please enter Password";
                return false;
            }
            return true;
        }



    });
