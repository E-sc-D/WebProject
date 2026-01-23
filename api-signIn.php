<?php
require_once 'bootstrap.php';

$result["error"] = "";

if(isset($_POST["username"]) && isset($_POST["password"])){
    $register_result = $dbh->registerUser($_POST["username"], $_POST["password"]);
    if(isset($register_result["user_id"])){
        registerLoggedUser($register_result["user_id"],$_POST["username"]);
        $result["user_id"] = $register_result["user_id"];
    } else {
        $result["error"] = $register_result["error"];
    }
} else { $result["error"] = "missingdata"; }

header('Content-Type: application/json');
echo json_encode($result);

?>