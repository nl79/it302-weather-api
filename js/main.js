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
    html += '<div class="div-current">';
    html += '<h2>' + data.weather.zipcode + '</h2>';
    html += '<h2>' + objCurrent['temp'] + ' - ' + objCurrent['temp_unit'] + '</h2>';
    html += '<h4>Precip: ' + objCurrent['humidity'] + '%</h4>';
    html += '<h4>Pressure:  ' + objCurrent['pressure'] + '</h4>';
    html += "</div>";

    html += "<div class='div-future'>";


    if(arrForecast instanceof Array && arrForecast.length > 0  ) {
        for(var i = 0; i < arrForecast.length; i++) {

            var day = arrForecast[i];

            /* div for each day */
            html += "<div class='div-day'>";
            html += "<h2>" + day.date + "</h2>";
            html += "<h3>Day Max Temp: " + day['day_max_temp'] + "</h3>";
            html += "</div>";
        }
    }

    html += "</div>";

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