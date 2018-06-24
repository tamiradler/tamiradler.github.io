angular.
  module('addSenagog').
  component('addSenagog', {
        templateUrl : "add-senagog/add-senagog.htm",
        controller : function ($scope, $http, Fact) {
          var self = this;

          if (Fact.senagog === '') {
            self.senagog = new Senagog();
            Fact.senagog = self.senagog;
          } else {
            self.senagog = Fact.senagog;
          }








          var telAviv = {lat: 32.086718, lng: 34.789760};
          
          var map = new google.maps.Map(document.getElementById('check_address_map'), {
            zoom: 14,
            center: telAviv
          });

          var addMarker = function(location) {
            marker = new google.maps.Marker({
              position: location,
              map: map
            });
        };

        map.addListener('click', function(event) {
          marker.setMap(null);
          addMarker(event.latLng);
        });

          

          var marker;
          

          // Get the modal
          var modal = document.getElementById('myModal');

          // Get the button that opens the modal
          var btn = document.getElementById("checkAddressBtn");

          // Get the <span> element that closes the modal
          var span = document.getElementsByClassName("close")[0];

          // When the user clicks the button, open the modal 
          btn.onclick = function() {
              if (self.senagog.address === "" || self.senagog.address === undefined) {
                self.senagog.alertAddress = true;
                $scope.$apply();
                return;
              }

              self.senagog.alertAddress = false;
              modal.style.display = "block";
              google.maps.event.trigger(map, 'resize')

              $http.get("https://script.google.com/macros/s/AKfycbxWJgCP0uIg5AgVxORyPWbZw4p7IJotc1aIcIdNFFqjmzIpUog/exec?fun=location&addre=" + self.senagog.address).then(
                function(response) {
                    var coordinate = response.data.split(",");
                    var coordinateForMap = {lat: Number(coordinate[0]), lng: Number(coordinate[1])};

                    if (marker !== undefined) {
                      marker.setMap(null);
                    }

                    marker = new google.maps.Marker({
                      position: coordinateForMap,
                      map: map
                  });

                  map.setCenter(coordinateForMap);
                  map.setZoom(15);
                }
            );
          }

          // When the user clicks on <span> (x), close the modal
          span.onclick = function() {
              modal.style.display = "none";
          }

          // When the user clicks anywhere outside of the modal, close it
          window.onclick = function(event) {
              if (event.target == modal) {
                  modal.style.display = "none";
              }
          }




          











          $scope.addMinyan = function () {
            var minyan = new Minyan();
            minyan.fixedNotFixedType = self.data.fixed_not_fixed_type[0].caption;
            minyan.isDakotLifneyAsString = self.data.before_after[0].caption;
            minyan.dakotLifneyAcharey = 5;
            minyan.dayAtWeekCaption = self.data.days_types[0].caption;
            minyan.typeCaption = self.data.minyan_types[0].caption;
            minyan.dayTimeCaption=self.data.time_types[0].caption;
            self.senagog.minyans.push(minyan);
          }



          $scope.removeMinyan = function (x) {
            console.log(x);
            self.senagog.minyans.splice(x, 1);
          }



          $http.get("config.json").then(
            function(response) {
              self.data = response.data;
              Fact.siteTitle = self.data.add_senagog;
              self.senagog.nosachCaption = self.data.nosach_types[0].caption;
            }
          );



          $scope.submit = function () {

            $http.get("https://script.google.com/macros/s/AKfycbxWJgCP0uIg5AgVxORyPWbZw4p7IJotc1aIcIdNFFqjmzIpUog/exec?fun=submitSenagog&senagog=" + JSON.stringify(self.senagog)).then(
              function(response) {
                console.log(response);
              }
          );
            
            console.log(self.senagog.minyans[0].dayTime);
          }


          $scope.timeChange = function(minyan) {
            if (minyan.timeNotFormated === undefined) {
              minyan.time="";
            } else {
              minyan.time=getFormatedTime(minyan.timeNotFormated);
            }
            console.log("base value change", minyan.time);
          }


          $scope.fixedNotFixedTypeChanged = function(minyan) {
            minyan.isFixedTime = isCodeRelatedToValu(self.data.fixed_not_fixed_type, "fixed_type", minyan.fixedNotFixedType);
          }


          $scope.isDakotLifneyAsStringChange = function(minyan) {
            minyan.isDakotLifney = isCodeRelatedToValu(self.data.before_after, "before", minyan.isDakotLifneyAsString);
          }


          $scope.dayAtWeekCaptionChange = function(minyan) {
            minyan.dayAtWeek = getCodeOfCaption(self.data.days_types, minyan.dayAtWeekCaption);
          }


          $scope.typeCaptionChange = function(minyan) {
            minyan.type = getCodeOfCaption(self.data.minyan_types, minyan.typeCaption);
          }

          
          $scope.dayTimeCaptionChange = function(minyan) {
            minyan.dayTime = getCodeOfCaption(self.data.time_types, minyan.dayTimeCaption);
          }

          $scope.setCoordinant = function() {
            var coordinant = marker.getPosition().lat() + "," + marker.getPosition().lng();
            self.senagog.coordinate = coordinant;
            span.onclick();
          }

          $scope.resetAddress = function () {
            btn.onclick();
          }

          $scope.nosachCaptionChange = function(senagog) {
            senagog.nosach = getCodeOfCaption(self.data.nosach_types, senagog.nosachCaption)
          }

          $scope.dakotLifneyAchareyChange = function(minyan) {
            debugger;
            if(minyan.dakotLifneyAcharey === undefined || minyan.dakotLifneyAcharey === "") {
              minyan.dakotLifneyAcharey = 0;
            }
          }
        }
  })

function Minyan() {
  this.type="SH";
  this.typeCaption="";
  this.time="";
  this.alertTime="";
  this.timeNotFormated="";
  this.isFixedTime=false;
  this.isDakotLifney=true; 
  this.isDakotLifneyAsString=""; 
  this.dakotLifneyAcharey="";
  this.dayTime="alot_hashahar";
  this.dayTimeCaption="";
  this.isSequense="";
  this.kolKamaZman="";
  this.dayAtWeek="hol_days_str";
  this.dayAtWeekCaption="";
}

function Senagog() {
  this.minyans = [];
  this.senagogName="";
  this.alertSenagogName=false;
  this.address="";
  this.alertAddress=false;
  this.coordinate="";
  this.alertCoordinate=true;
  this.nosach="nosach_achid";
  this.nosachCaption="";
}



function getFormatedTime(timeNotFormated) {
  var formatedTime = timeNotFormated.getHours();
  if (timeNotFormated.getHours() < 10) {
    formatedTime = "0"+formatedTime;
  }
  formatedTime = formatedTime + ":";

  if (timeNotFormated.getMinutes() < 10) {
    formatedTime = formatedTime + "0" + timeNotFormated.getMinutes();
  } else {
    formatedTime = formatedTime + timeNotFormated.getMinutes();
  }
  return formatedTime;
}



