<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = "";
//controllo di condizioni di accesso al database
if (isUserLoggedIn()){
    $queryResult = $dbh->getPosts(
    $_GET["limit"],
    $_GET["offset"],
    $_GET["order"],
    $_GET["filter"],
    $_GET["id"]
    );
    //controllo di esito della query
    switch ($queryResult["error"]) {        
        default:
            $response = $queryResult;
            break;
    }

} else {
    $response["error"] = "nologin";
}

header('Content-Type: application/json');
echo json_encode($response);
?>