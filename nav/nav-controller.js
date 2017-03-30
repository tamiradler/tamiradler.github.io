var NAV_MENUE_ITEMS_URL = "https://script.google.com/macros/s/AKfycbxWJgCP0uIg5AgVxORyPWbZw4p7IJotc1aIcIdNFFqjmzIpUog/exec?fun=getNavMenue";

angular.module("navApp").controller('navCont',
    function($scope,$http) {
        $http.get(NAV_MENUE_ITEMS_URL)
            .then(
                function(response) {
                    $scope.navList = response.data;
                }
            );
    }
)