angular.
  module('sideNav').
  component('sideNav', {
        templateUrl : "side-nav/side-nav.htm",
        controller : function ($http, Fact) {
            
            var self = this;

            self.fact = Fact;//shared data

            $http.get("config.json").then(
                function(response) {
                    self.data = response.data;
                }
            );
        }
    });


    var rows;

    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        rows.classList.toggle("change");
    }
    
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        rows.classList.toggle("change");
    }

    function openCloseToggle(x) {
        rows = x;
        if (!x.classList.contains("change")) {
            openNav();
        } else {
            closeNav();
        }
    }