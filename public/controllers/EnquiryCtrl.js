
angular.module('myApp')
    .controller('EnquiryCtrl', function ($scope, $location, $http, $localStorage) {

        $scope.addUser = function () {
            if (!$scope.validate()) {
                return;
            }
            $scope.showMLoader();
            $scope.requestData = {};
            $scope.requestData.fullName = $scope.fullName;
            $scope.requestData.emailId = $scope.emailId;
            $scope.requestData.msg = $scope.msg;
            $scope.requestData.audit = $scope.audit;
            $scope.requestData.hearfrom = $scope.hearfrom;

        }
        $scope.makeEmpty = function () {
            $scope.fullName = "";
            $scope.email = "";
            $scope.msg = "";
            $scope.audit = "";
            $scope.hearfrom = "";

        }
        $scope.makeEmptyValidators = function () {
            $("#fullnameID").html("");
            $("#emailID").html("");
            $("#msgID").html("");
            $("#auditID").html("");
            $("#hearfromID").html("");

        }
        //shows Loader for Modal
        $scope.showMLoader = function () {
            $('.loding-indicator-modal').css('display', 'inline-block');
        }
        //hide Loader for Modal
        $scope.hideMLoader = function () {
            $('.loding-indicator-modal').css('display', 'none');
        }
        $scope.validate = function () {
            $scope.makeEmptyValidators();
            if ($scope.fullName == "" || $scope.fullName == undefined) {
                $("#fullnameID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            }
            if ($scope.email == "" || $scope.email == undefined) {
                $("#emailID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            }
            if ($scope.msg == "" || $scope.msg == undefined) {
                $("#msgID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            }
            if ($scope.audit == "" || $scope.audit == undefined) {
                $("#auditID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            }
            if ($scope.hearfrom == "" || $scope.hearfrom == undefined) {
                $("#hearfromID").html("<ul class='errorlist'>This field is required.<li></li></ul>");
            }
            return true;
        }

    });
