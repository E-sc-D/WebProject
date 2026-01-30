<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = [];
//controllo di condizioni di accesso al database

if (isUserLoggedIn()) {
    $queryResult = $dbh->getUserById(
        $_SESSION["user_id"],
    );

    //controllo di esito della query
    switch ($queryResult["error"]) {
        case '':
            $response["data"] = $queryResult["data"]; 
            $response["error"] = $queryResult["error"];
            break;
        
        default:
            # code...
            break;
    } 
} else {$response["error"] = "loginerror";}
        
header('Content-Type: application/json');
echo json_encode($response);
?>