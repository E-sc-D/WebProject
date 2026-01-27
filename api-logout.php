<?php
require_once 'bootstrap.php';

$_SESSION = [];

session_destroy();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(), // usually PHPSESSID
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

header('Content-Type: application/json');
echo json_encode([]);

?>