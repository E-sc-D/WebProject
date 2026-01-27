<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = "";
//controllo di condizioni di accesso al database
if (isUserLoggedIn()) {
    if(isValidString($_GET["user_id"] ?? null) &&
        isValidString($_GET["username"] ?? null) && 
        isValidString($_GET["email"] ?? null) &&
        isValidString($_GET["bio"] ?? null)){
        $queryResult = $dbh->updateUser(
            $_GET["user_id"],
            $_GET["username"],
            $_GET["email"],
            $_GET["bio"]
            );
        //controllo di esito della query
        switch ($queryResult["error"]) {
            default:
                $response = $queryResult;
                break;
        }
    } else {$response["error"] = "dataerror";}
} else {
    $response["error"] = "nologin";
}

header('Content-Type: application/json');
echo json_encode($response);
?>