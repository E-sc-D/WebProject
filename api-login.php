<?php
require_once 'bootstrap.php';

$result["error"] = "";
$result["data"] = "";

if(isset($_POST["username"]) && isset($_POST["password"])){
    $login_result = $dbh->checkLogin($_POST["username"], $_POST["password"]);

    switch($login_result["error"]){
        case "":
            registerLoggedUser($login_result["data"]["user_id"],
                            $login_result["data"]["username"]); 
            $result = $login_result;
            break;
        default:
            $result = $login_result;
            break;
    }
} else { 
    $result["error"] = "missingdata"; 
}

header('Content-Type: application/json');
echo json_encode($result);

?>