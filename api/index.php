<?php
/**
 * Created by PhpStorm.
 * User: nazar
 * Date: 4/8/2015
 * Time: 10:38 AM
 */


/*API token */
$token = "AWrXOHyIiK";

/*get the zipcode from the request */
$zipcode = isset($_REQUEST['zipcode']) &&
            !empty($_REQUEST['zipcode']) &&
            is_numeric($_REQUEST['zipcode']) &&
            strlen($_REQUEST['zipcode']) == 5
             ? $_REQUEST['zipcode'] : null;

/* build the output object */
$output = array();

if(!is_null($zipcode)) {

    /*url */
    $url = "http://www.myweather2.com/developer/forecast.ashx?uac=AWrXOHyIiK&output=json&temp_unit=f&ws_unit=mph&query=" . $zipcode;

    /* make the api call */
    $res = file_get_contents($url);

    /* try to decode the json and validate that a valid json object was returned. */
    $json = json_decode($res, true);

    if(!is_null($json)) {
        $output['StatusCode'] = 200;
        $output['type'] = 'data';
        $output['data'] = $json;
    } else {
        $output['StatusCode'] = 400;
        $output['type'] = 'message';
        $output['message'] = 'Failed failed to retrieve the weather ojbect. Please make sure the zipcode provided is valid';
    }

} else {
    $output['StatusCode'] = 400;
    $output['type'] = 'message';
    $output['message'] = 'Invalid Zipcode Supplied';

}


echo(json_encode($output));
exit;