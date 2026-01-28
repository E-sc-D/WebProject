<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = "";
//controllo di condizioni di accesso al database
if (isUserLoggedIn()) {
    if( isValidString($_POST["username"] ?? null) && 
        isValidString($_POST["email"] ?? null) &&
        isValidString($_POST["bio"] ?? null)){
        $queryResult = $dbh->updateUserInfo(
            $_SESSION["user_id"],
            $_POST["username"],
            $_POST["email"],
            $_POST["bio"]
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