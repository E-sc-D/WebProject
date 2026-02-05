<?php
require_once 'bootstrap.php';
$result["data"] = "";
$result["error"] = "";

if(isValidString($_POST["username"] ?? null) && 
        isValidString($_POST["email"] ?? null) &&
        isValidString($_POST["password"] ?? null)){

    $query_result = $dbh->signInUser($_POST["username"], $_POST["email"],$_POST["password"]);
    switch ($query_result["error"]) {
        case '':
            registerLoggedUser($query_result["data"]["user_id"],$_POST["username"],0);
            $result["data"] = $query_result["data"]["user_id"];
            break;
        
        default:
            $result["error"] = $query_result["error"];
            break;
    }

} else { $result["error"] = "missingdata"; }

header('Content-Type: application/json');
echo json_encode($result);

?>