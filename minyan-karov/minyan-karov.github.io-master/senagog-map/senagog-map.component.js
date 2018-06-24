angular.
  module('senagogMap').
  component('senagogMap', {
        templateUrl : "senagog-map/senagog-map.htm",
        controller : function ($http, Fact) {
            
            var self = this;
            self.session = {};
            //Tel Aviv - 32.086718, 34.789760
            var telAviv = {lat: 32.086718, lng: 34.789760};
            
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 9,
                center: telAviv
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position)    {
                    console.log(position);
                    var location = {lat: position.coords.latitude, lng: position.coords.longitude};
                    console.log(location);
                    console.log(map);
                    map.setCenter(location);
                    map.setZoom(15);
                });
            }

            $http.get("config.json").then(
                function(response) {
                  self.data = response.data;
                  self.session.data = response.data;
                  Fact.siteTitle = response.data.show_map;
                }
            );

            $http.get("https://script.google.com/macros/s/AKfycbxWJgCP0uIg5AgVxORyPWbZw4p7IJotc1aIcIdNFFqjmzIpUog/exec?fun=getSenagogs").then(
                function(response) {
                    drowSenagogs(response.data, map, self.session);
                }
            );
        }
    });

    /**
     * The function is drowing the map with the senagog array.
     * 
     * @param {*} senagogs 
     * @param {*} map 
     */
    function drowSenagogs(senagogs, map, session){
        senagogs.forEach(function (senagog)
        {
            var coordinate = senagog.coordinate.split(",");
            var coordinateForMap = {lat: Number(coordinate[0]), lng: Number(coordinate[1])};

            var marker = new google.maps.Marker({
                position: coordinateForMap,
                map: map,
                title: senagog.senagogName
            });


            var contentString = retrieveInfowindowContentString(senagog, session);

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
        });
    }



    /**
     * The method retrieve the Infowindow contentString for the google.maps.InfoWindow.
     * 
     * @param {Array} senagog 
     * @returns contentString 
     */
    function retrieveInfowindowContentString(senagog, session) {
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
            '<h1>'+ senagog.senagogName +'</h1>'+
                '<p>' + session.data.next_minyan + '</p>'+
                '<p>' + retrieveNextMinyanTime(senagog, session) + '</p>'+
                '<a href=#!/blue/3/ch/4">'+ session.data.more_information +'</a> '+            
        '</div>';

        return contentString;
    }


    function getZmanim(senagog) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        var cord = senagog.coordinate;

        var zmanim = new Zmanim(dd, mm, yyyy);
        zmanim.setLatitude(Number(cord[0]));
        zmanim.setLongitude(Number(cord[1]));

        return zmanim;
    }


    function retrieveNextMinyanTime (senagog, session) {
        var retVal = "";
        
        var minyans = senagog.minyans;
        retVal += getCaptionOfCode(session.data.minyan_types, minyans[0].type);
        retVal += " "
        retVal += session.data.at;
        retVal += " ";
        
        if (!minyans[0].isFixedTime) {
            retVal += minyans[0].time;
        } else {
            var dakotLifneyAcharey = minyans[0].dakotLifneyAcharey;
            if (minyans[0].isDakotLifney) {
                dakotLifneyAcharey = -1*dakotLifneyAcharey;
            }

            var zmanim = getZmanim(senagog);
            if ("alot_hashahar" === minyans[0].dayTime) {
                retVal += zmanim.getAlotHashahar(dakotLifneyAcharey);
            } else if ("netz" === minyans[0].dayTime) {
                retVal += zmanim.getSunriseTime(dakotLifneyAcharey);
            } else if ("tzet_hakohavim" === minyans[0].dayTime) {
                retVal += zmanim.getTzetHakohavim(dakotLifneyAcharey);
            } else if ("noon" === minyans[0].dayTime) {
                retVal += zmanim.getNoon(dakotLifneyAcharey);
            } else if ("shkiaa" === minyans[0].dayTime) {
                retVal += zmanim.getSunsetTime(dakotLifneyAcharey);
            }
        }

        return retVal;
    }