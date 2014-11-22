'use strict'

angular.module('flagAdmin.reports', [
    'ngRoute',
    'ui.bootstrap',
    'hills.services'
]).config(['$routeProvider', function ($routeProvide) {
    $routeProvide.when('/reports', {
        templateUrl: 'admin-content/reports/reports.html',
        controller: 'reportsCtrl'
    })
}]).controller('reportsCtrl', ['$scope','$http','$timeout', function ($scope, $http, $timeout) {

    var getStatsPromise = null;

    function init()
    {
        getPhotos();
        getStats();

        $scope.$on('$destroy', function () {
            $timeout.cancel(getStatsPromise);
        });
    }

    function getPhotos(page, source) {
        page = page || $scope.paginator.currentPage;
        source = source || $scope.sourceFilter;
        $http.get('/api/photo', {
            params: {
                page: page,
                source: source
            }
        }).success(function (data) {
            $scope.images = data.data;
            $scope.paginator = data.paginator;
        });
    }

    function getStats()
    {
        console.log('getting stats',new Date());
        $http.get('/api/stats').success(function(data){
            $scope.stats = data;
        });
        getStatsPromise = $timeout(getStats, 5000);
    }

    $scope.stats ={
        twitter: 0,
        instagram: 0,
        media_pole: 0
    };
    $scope.status = {
        new: 1,
        approved: 2,
        rejected: 3
    };

    $scope.paginator = {
        currentPage: 1,
        numOfPages: 1
    };

    $scope.sourceFilter = '';

    $scope.$watch('sourceFilter', function(newValue,oldValue){
        if(newValue != oldValue){
            getPhotos(1);
        }
    });


    $scope.pageChanged = function () {
        getPhotos();
    };

    $scope.filterSet = function(source){
        $scope.sourceFilter = source;
    };


    init();
}]);