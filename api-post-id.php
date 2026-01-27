<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = "";
//controllo di condizioni di accesso al database
if (isUserLoggedIn()) {
    $queryResult = $dbh->getPostById(
        $_GET["post_id"]
    );
    //controllo di esito della query
    if(isset($queryResult["error"])){
        $response["error"] = $queryResult["error"]; 
    } else {
       $response["data"] = $queryResult; 
    }

} else {
    $response["error"] = "nologin";
}

header('Content-Type: application/json');
echo json_encode($response);
?>