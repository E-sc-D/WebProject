<?php
require_once 'bootstrap.php';

$response["error"] = "";
$response["data"] = "";
//controllo di condizioni di accesso al database

if (isUserLoggedIn()) {
    if(isset($_GET["post_id"])){

        $pid = filter_input(INPUT_GET, 'post_id', FILTER_VALIDATE_INT);

        if ($pid === false || $pid === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid postid, {$_GET['post_id']}"]);
            exit;
        }
    
        $queryResult = $dbh->togglePostLike(
            $_SESSION["user_id"],
            $_GET["post_id"]
        );

        //controllo di esito della query
        if(isset($queryResult["error"])){
            $response["error"] = $queryResult["error"]; 
        } else {
            $response["data"] = $queryResult["data"]; 
        }  
    } else {
        $response["error"] = "iderror";
    }
} else {
    $response["error"] = "nologin";
}

header('Content-Type: application/json');
echo json_encode($response);
?>