function Zmanim(iDay, iMonth, iYear) {

    this.day = iDay;
    this.month = iMonth;
    this.year = iYear;
    

    // location of tel aviv
    var latitude = 32.0497535;
    var longitude = 34.8016837;

    this.setLatitude = function(iLatitude) {
        this.latitude = iLatitude;
    }

    this.setLongitude = function(iLongitude) {
        this.longitude = iLongitude;
    }

    this.getNoon = function(iAddedSecound) {
        var addedSecound = 0;
        if (!iAddedSecound === undefined) {
            addedSecound = iAddedSecound;
        }

        var day = this.computeDay();
        var sunrise = this.computeSunrise(day, true);
        var sunset = this.computeSunrise(day, false);

        var noon = (sunset + sunrise)/2;
        return this.secoundsToTime(noon + addedSecound);
    }

    this.getAlotHashahar = function(iAddedSecound) {
        var addedSecound = 0;
        if (!iAddedSecound === undefined) {
            addedSecound = iAddedSecound;
        }

        var day = this.computeDay();
        var sunrise = this.computeSunrise(day, true);
        return this.secoundsToTime(sunrise - 72*60 + addedSecound);
    }

    this.getTzetHakohavim = function(iAddedSecound) {
        var addedSecound = 0;
        if (!iAddedSecound === undefined) {
            addedSecound = iAddedSecound;
        }

        var day = this.computeDay();
        var sunset = this.computeSunrise(day, false);
        return this.secoundsToTime(sunset + 25*60 +addedSecound);
    }

    /**
     * The method return the sunrise time in HH:MM:SS format.
     *
     * @return
     */
    this.getSunriseTime = function(iAddedSecound) {
        var addedSecound = 0;
        if (!iAddedSecound === undefined) {
            addedSecound = iAddedSecound;
        }

        var day = this.computeDay();
        var sec = this.computeSunrise(day, true);
        return this.secoundsToTime(sec+addedSecound);
    }


    /**
     * The method return the sunset time in HH:MM:SS format.
     *
     * @return
     */
    this.getSunsetTime = function(iAddedSecound) {
        var addedSecound = 0;
        if (!iAddedSecound === undefined) {
            addedSecound = iAddedSecound;
        }

        var day = this.computeDay();
        var sec = this.computeSunrise(day, false);
        return this.secoundsToTime(sec+addedSecound);
    }




    /**
     * The method get time in secound from 00:00 and return the time in format HH:MM:SS.
     *
     * @param secounds
     * @return
     */
    this.secoundsToTime = function(secounds) {
        var h = parseInt (secounds/(60*60));
        secounds -= h*(60*60);
        var m = parseInt (secounds/60);
        secounds -= m*60;

        var min = "";
        if (m < 10) {
            min = "0" + m.toString();
        }
        else {
            min = m.toString();
        }

        var sec = "";
        if (secounds < 10) {
            sec = "0" + parseInt(secounds).toString();
        }
        else {
            sec = parseInt(secounds).toString();
        }

        var time = h.toString() + ":" + min + ":" + sec;
        return time;
    }



    /**
     * The method return the number of the day in the year.
     *
     * @return
     */
    this.computeDay = function() {
        var N1 = Math.floor(275.0 * this.month / 9.0);
        var N2 = Math.floor((this.month + 9.0) / 12.0);
        var N3 = (1 + Math.floor((this.year - 4.0 * Math.floor(this.year / 4.0) + 2.0) / 3.0));
        var N = N1 - (N2 * N3) + this.day - 30.0;

        return N;
    }


    /**
     * The method will return the time of sunrise if sunrise = true, else will return sunset.
     * The return vslue is in secound after 00:00.
     *
     * @param day
     * @param sunrise
     * @return
     */
    this.computeSunrise = function(day, sunrise)
    {
        var zenith = 90.83333333333333;
        var D2R = Math.PI / 180.0;
        var R2D = 180.0 / Math.PI;

        // convert the longitude to hour value and calculate an approximate time
        var lnHour = longitude / 15.0;
        var t;
        if (sunrise) {
            t = day + ((6.0 - lnHour) / 24.0);
        } else {
            t = day + ((18.0 - lnHour) / 24.0);
        }

        //calculate the Sun's mean anomaly
        var M = (0.9856 * t) - 3.289;


        //calculate the Sun's true longitude
        var L = M + (1.916 * Math.sin(M * D2R)) + (0.020 * Math.sin(2.0 * M * D2R)) + 282.634;
        if (L > 360.0) {
            L = L - 360.0;
        } else if (L < 0.0) {
            L = L + 360.0;
        }


        //calculate the Sun's right ascension
        var RA = R2D * Math.atan(0.91764 * Math.tan(L * D2R));
        if (RA > 360.0) {
            RA = RA - 360.0;
        } else if (RA < 0.0) {
            RA = RA + 360.0;
        }


        //right ascension value needs to be in the same qua
        var Lquadrant = (Math.floor(L / (90.0))) * 90.0;
        var RAquadrant = (Math.floor(RA / 90.0)) * 90.0;
        RA = RA + (Lquadrant - RAquadrant);


        //right ascension value needs to be converted into hours
        RA = RA / 15.0;

        //calculate the Sun's declination
        var sinDec = 0.39782 * Math.sin(L * D2R);
        var cosDec = Math.cos(Math.asin(sinDec));

        //calculate the Sun's local hour angle
        var cosH = (Math.cos(zenith * D2R) - (sinDec * Math.sin(latitude * D2R))) / (cosDec * Math.cos(latitude * D2R));
        var H;
        if (sunrise) {
            H = 360.0 - R2D * Math.acos(cosH);
        } else {
            H = R2D * Math.acos(cosH);
        }
        H = H / 15.0;


        //calculate local mean time of rising/setting
        var T = H + RA - (0.06571 * t) - 6.622;

        //adjust back to UTC
        var UT = T - lnHour;
        if (UT > 24.0) {
            UT = UT - 24.0;
        } else if (UT < 0.0) {
            UT = UT + 24.0;
        }

        //convert UT value to local time zone of latitude/longitude
        var localT = UT + 3.0;

        //convert to Milliseconds
        return localT * 3600.0;// * 1000;
    }
}