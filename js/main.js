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
        alert('Invalid Zipcode Value Supplied');
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

        if(data.statusCode == 200){

        } else {
            //display error.
            /*
             $('p#p-message').slideDown(400);

             return;
             */
        }
    };

    //post the data to the server.
    $.ajax(settings).done(callback);
}