<?php
require_once 'bootstrap.php';

$result["logineseguito"] = false;

if(isset($_POST["username"]) && isset($_POST["password"])){
    $login_result = $dbh->checkLogin($_POST["username"], $_POST["password"]);
    if(count($login_result) == 0){
        //Login fallito
        $result["errorelogin"] = "Username e/o password errati";
    }
    else{
        registerLoggedUser($login_result[0]["user_id"],
                            $login_result[0]["username"]);
                            
    }
} else {
    //mancano dei dati al login
}

if(isUserLoggedIn()){
    $result["logineseguito"] = true;
}

header('Content-Type: application/json');
echo json_encode($result);

?>