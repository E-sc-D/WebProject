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
    
        $queryResult = $dbh->getCommentsByPost(
            $pid,
            //ordine specificabile
        );
        //controllo di esito della query
        switch ($queryResult["error"]) {
            case '':
                $response["data"] = $queryResult["data"]; 
                $response["error"] = $queryResult["error"];
                break;
            
            default:
                # code...
                break;
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