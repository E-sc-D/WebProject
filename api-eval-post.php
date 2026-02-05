<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = [];
//controllo di condizioni di accesso al database

if (isUserLoggedIn() && isUserPower()) {
    if(isset($_GET["blocked"]) && isset($_GET["post_id"])){
        $queryResult = $dbh->evalPost(
            $_GET["post_id"],
            $_GET["blocked"]
        );
        $response = $queryResult; 
        /* 
        //controllo di esito della query
        switch ($queryResult["error"]) {
            case '':
                $response["data"] = $queryResult["data"]; 
                $response["error"] = $queryResult["error"];
                break;
            
            default:
                $response["error"] = $queryResult["error"];
                break; 
        } */
    
    } else {$response["error"] = "dataerror";}
    

} else {$response["error"] = "loginerror";}
        
header('Content-Type: application/json');
echo json_encode($response);
?>