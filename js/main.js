$(document).ready(function() {
    $('a#a-submit').on('click', validate);
})

/*
validate the user zipcode
 */
function validate() {

    var zipcode = $('input#input-zipcode').val();

    if(zipcode == undefined ||
        zipcode == '' || zipcode.length != 5 || isNaN(zipcode)) {

        message('Invalid Zipcode Value Supplied', 1500);
        return;
    }

    /* validate that data for the current zipcode is not already showing */
    if($('div#' + zipcode).length != 0) {
        message('Weather Data for Zipcode:' + zipcode + " is already loaded", 1500);
        return;
    }



    /* if the data is valid, issues an ajax call to the weather api */

    var settings = {
        type:"POST",
        url: '/api/',
        data: 'zipcode=' + zipcode,
        dataType: 'json',
        beforeSend: '',
        success: ''
    };

    var callback = function(data){

        switch(data.statusCode) {

            case 200:
                /* set the zipcode into the data object */
                data.data.weather.zipcode = zipcode;
                render(data.data);

                break;

            default:

                message(data.message, 1500);

                break;
        }

    };

    //post the data to the server.
    $.ajax(settings).done(callback);
}

function render(data) {

    //console.log(data.weather);

    /* get the current weather object */
    var objCurrent = data.weather.curren_weather[0];

    /* get the two day forecast object array */
    var arrForecast = data.weather.forecast;

    console.log(objCurrent);
    console.log(arrForecast);

    /*build the html*/
    var html = '<div id="' + data.weather.zipcode + '" data-role="collapsible"><h3>' + data.weather.zipcode + '</h3><p>';
    html += '<div class="div-current float-left">';
    html += "<h2>Current</h2>";
    html += '<h2>' + data.weather.zipcode + '</h2>';
    html += '<h2>' + objCurrent['temp'] + '&deg; ' + objCurrent['temp_unit'].toUpperCase() + '</h2>';
    html += '<h4>Precip: ' + objCurrent['humidity'] + '%</h4>';
    html += '<h4>Pressure:  ' + objCurrent['pressure'] + '</h4>';
    html += "</div>";

    html += "<div class='div-future'>";


    if(arrForecast instanceof Array && arrForecast.length > 0  ) {
        for(var i = 0; i < arrForecast.length; i++) {

            var day = arrForecast[i];

            /* div for each day */
            html += "<div class='div-day float-left'>";

            html += "<h2>" + day.date + "</h2>";

            /*daytime info*/
            html += "<div class='div-daytime div-container inline-block'>"
            html += "<h3 class='h3-day'>High (Day): " + day['day_max_temp'] + "&deg; (" + day['temp_unit'].toUpperCase() + ")</h4>";
            html += "<h4>" + day.day[0].weather_text + "</h2>";
            html += "<h4>Winds: " + day.day[0].wind[0].dir + " " + day.day[0].wind[0].speed + " " + day.day[0].wind[0].wind_unit + "</h4>";
            html += "</div>";

            /*night time info */
            html += "<div class='div-nighttime div-container inline-block'>"
            html += "<h3 class='h3-night'>Low (Night): " + day['night_min_temp']+ "&deg; (" + day['temp_unit'].toUpperCase() + ")</h3>";
            html += "<h4>" + day.night[0].weather_text + "</h2>";
            html += "<h4>Winds: " + day.night[0].wind[0].dir + " " + day.night[0].wind[0].speed + " " + day.night[0].wind[0].wind_unit + "</h4>";
            html += "</div>";

            html += "</div>";


        }
    }

    html += "</div><div class='clear-both'></div>";

    html += "</p></div>";

    $('div#div-content').append($.parseHTML(html)).collapsibleset('refresh');

}

function message(message, delay) {
    $.mobile.loading('show',
        { theme: "e", text: (message || 'ERROR'),
            textonly: true, textVisible: true });
    setTimeout(function() {
        $.mobile.loading('hide');
    }, ((delay && delay > 0) ? delay : 1000));
}