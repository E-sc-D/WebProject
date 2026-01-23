<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = "";
//controllo di condizioni di accesso al database
if (isUserLoggedIn()) {
    $queryResult = $dbh->getPosts(
    $_GET["limit"],
    $_GET["offset"],
    $_GET["order"],
    $_GET["filter"],
    $_GET["id"]
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