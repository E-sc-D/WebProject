<?php
function isActive($pagename){
    if(isset($_GET['page']) && $_GET['page']==$pagename){
        echo " class='active' ";
    }
}

function getIdFromName($name){
    return preg_replace("/[^a-z]/", '', strtolower($name));
}

function isUserLoggedIn(){
    return !empty($_SESSION['user_id']);
}

function registerLoggedUser($user_id,$username){
    $_SESSION["user_id"] = $user_id;
    $_SESSION["username"] = $username;
}

function isValidString($value): bool
{
    return isset($value) && is_string($value) && trim($value) !== '';
}


?>