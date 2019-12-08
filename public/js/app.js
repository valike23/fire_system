/// <reference path="../leaflet/leaflet.js" />
/// <reference path="angular.js" />
(function () {
    var app = angular.module('app', ['ui.router']);
    app.directive('fileInput', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileInput),
                    modelSetter = model.assign;
                element.bind('change', function () {


                    scope.$apply(function () {
                        //set the model value
                        modelSetter(scope, element[0].files);
                    });
                });
            }
        };
    }])

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
            .state('note', {
                url: "/notifications",
                templateUrl: "./templates/note.htm",
                controller: "noteCtrl"
            }).state('news', {
                url: "/news",
                templateUrl: "./templates/news.htm",
                controller: "newsCtrl"
            })
        $urlRouterProvider.otherwise('/records');
    });
    app.run(function ($state) {
        $state.go('home')
    })
    app.controller('navCtrl', function () {

    })
    app.controller('homeCtrl', function ($scope, $http) {

        var mymap = L.map('mapid').setView([6.3475564, 5.5023797], 12);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibHVkaWtlMjMiLCJhIjoiY2swZG5oOXZyMDAwNDNubW9uMm5nM3FhayJ9.gRrOd1UAaZ79JFZID8F4uw'
        }).addTo(mymap);
        $http.get('api/getActiveInc').then(function (res) {
            $scope.markers = [];

            res = res.data;
            $scope.fires = res.data;
            for (var i = 0; i < res.length; i++) {
                $scope.markers.push(L.marker([res[i].latitude, res[i].longitude]).addTo(mymap));
                $scope.markers[i].bindPopup("<div onclick='console.log(" + res[i].id + ") ; alert();currentMap = " + res[i] + "'><strong>" + res[i].name + "</strong><br/>" + res[i].address + "</div>").openPopup();
            }
            console.log($scope.markers);

        })

    });

    app.controller('recordCtrl', function ($scope, $http) {
        $scope.accept = function (inc) {
            $http.get('/api/changeStatus/' + 1 + '/' + inc.id).then(function (res) {
                alert("The Report have been validated");
            }, function (err) {
                alert("something went wrong");
                console.log(err);
            })
        }
        $scope.viewImage = function (inc) {
            $('#lecModal').modal('show');
        }
        $http.get('/api/getAllInc').then(function (res) {
            $scope.incs = res.data;
            console.log(res);
        }, function (err) {
            console.log(err);
            alert("Something Went Wrong")
        })


    });
    app.controller('noteCtrl', function ($scope, $http) {
        $('#loader').modal('show');
        $http.get('api/notifications').then(function (res) {
            $('#loader').modal('hide');
            console.log(res);
            $scope.notes = res.data;
        }, function (err) {
            alert("Notifications Failed to Load");
            console.log(err)
            })
        $scope.addNote = function () {
            $('#loader').modal('show');

            $http.post('/api/notifications', $scope.newNote).then(function (res) {
                $('#loader').modal('hide');
                alert("notification has been added!");
                $scope.newNote = {};
                $('#addNote').modal('hide');
            }, function (err) {
                $('#loader').modal('hide');
                alert("An error occured");
                console.log(err);
            })
        }
    })
    app.controller('newsCtrl', function ($scope, $http) {
        $scope.newNews = {};
        $scope.$watch("landPermit", function () {

          //  if ($scope.landPermit == undefined || $scope.landPermit.length == 0) return;
            var reader = new FileReader();
            reader.onload = function () {
                
                var dataURL = reader.result;
               var output = document.getElementById('output');
                $scope.newNews.image = dataURL;
                output.src = dataURL;
            };
            reader.readAsDataURL($scope.landPermit[0]);
            console.log("my images", $scope.newNews.image);

        })
        $('#loader').modal('show');
        $http.get('api/notifications').then(function (res) {
            $('#loader').modal('hide');
            console.log(res);
            $scope.news = res.data;
        }, function (err) {
            alert("News Failed to Load");
            console.log(err)
        })
        $scope.addNews = function () {
            //$('#loader').modal('show');
            console.log($scope.newNews);
            alert("ok")

            //$http.post('/api/notifications', $scope.newNote).then(function (res) {
            //    $('#loader').modal('hide');
            //    alert("notification has been added!");
            //    $scope.newNote = {};
            //    $('#addNote').modal('hide');
            //}, function (err) {
            //    $('#loader').modal('hide');
            //    alert("An error occured");
            //    console.log(err);
            //})
        }
    })

    function open() {
        alert("working");
    }
})()