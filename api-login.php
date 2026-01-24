<?php
require_once 'bootstrap.php';

$result["error"] = "";

if(isset($_POST["username"]) && isset($_POST["password"])){
    $login_result = $dbh->checkLogin($_POST["username"], $_POST["password"]);
    if(count($login_result) == 0){
        //Login fallito
        $result["error"] = "dataerror";
    }
    else{
        registerLoggedUser($login_result[0]["user_id"],
                            $login_result[0]["username"]);
                            
    }
} else { $result["error"] = "missingdata";}


header('Content-Type: application/json');
echo json_encode($result);

?>