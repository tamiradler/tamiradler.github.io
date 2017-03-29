function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "https://script.google.com/macros/s/AKfycbxWJgCP0uIg5AgVxORyPWbZw4p7IJotc1aIcIdNFFqjmzIpUog/exec?fun=getSenagogs", true);
    xhttp.send();
}