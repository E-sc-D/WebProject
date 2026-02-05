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

function isUserPower(){
    return $_SESSION["power"] == 1;
}

function registerLoggedUser($user_id,$username,$power){
    $_SESSION["user_id"] = $user_id;
    $_SESSION["username"] = $username;
    $_SESSION["power"] = $power;
}

function isValidString($value): bool
{
    return isset($value) && is_string($value) && trim($value) !== '';
}


?>