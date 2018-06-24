angular.module("myApp", ["ngRoute","senagogMap","zmanim","sideNav","addSenagog"])
	.controller('ChapterController', function($scope, $routeParams) {
				$scope.params = $routeParams;
			}
		);
