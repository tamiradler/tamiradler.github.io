angular.module("navApp").controller('navCont',
    function($scope) {
        $scope.navList = getNavList();
    }
)

function getNavList() {
    return ['a','b','c','d','e'];
}