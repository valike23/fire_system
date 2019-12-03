/// <reference path="../leaflet/leaflet.js" />
/// <reference path="angular.js" />
(function () {
    var app = angular.module('app', ['ui.router']);
    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: "/home",
            templateUrl: "./templates/dashboard.htm",
            controller: "homeCtrl"
        }).state('records', {
            url: "/records",
            templateUrl: "./templates/table.htm",
            controller: "recordCtrl"
        })
        $urlRouterProvider.otherwise('/records');
    });
    app.run(function ($state) {
        $state.go('home')
    })
    app.controller('navCtrl', function () {

    })
    app.controller('homeCtrl', function ($scope,$http) {

        var mymap = L.map('mapid').setView([6.3475564, 5.5023797], 12);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibHVkaWtlMjMiLCJhIjoiY2swZG5oOXZyMDAwNDNubW9uMm5nM3FhayJ9.gRrOd1UAaZ79JFZID8F4uw'
        }).addTo(mymap);
        $http.get('api/getActiveInc').then(function (res) {
            console.log(res);

        })
        var marker = L.marker([51.5, -0.09]).addTo(mymap);
    });

    app.controller('recordCtrl', function ($scope) {
        function loadBC() {
            $http.get('http://40.67.150.6/adportal/api/AppConfig/GetBusinessCategory').then(function (res) {
                $scope.loaderBC = false;
                $scope.bcs = res.data;
                var test = res.data;
                BCL = test.length;
                var data = [];
                for (var i = 0; i < test.length; i++) {
                    data[i] = [test[i].id, test[i].code, test[i].name, test[i].timeReport, test[i].status]
                }
                $('#tableBC').DataTable({
                    data: data
                });

            })


        }
    })
})()