<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = [];
//controllo di condizioni di accesso al database

if (isUserLoggedIn() && isUserPower()) {
    $queryResult = $dbh->getAdminPage();

    //controllo di esito della query
    switch ($queryResult["error"]) {
        case '':
            $response["data"] = $queryResult["data"]; 
            $response["error"] = $queryResult["error"];
            break;
        
        default:
            $response["error"] = $queryResult["error"];
            break;
    } 
} else {$response["error"] = "loginerror";}
        
header('Content-Type: application/json');
echo json_encode($response);
?>