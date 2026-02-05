<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = [];
//controllo di condizioni di accesso al database

if (isUserLoggedIn() && isUserPower()) {
    if(isset($_GET["post_id"])){
        $queryResult = $dbh->removeReports(
            $_GET["post_id"],
        );
        $response = $queryResult; 
        
    
    } else {$response["error"] = "dataerror";}
    

} else {$response["error"] = "loginerror";}
        
header('Content-Type: application/json');
echo json_encode($response);
?>