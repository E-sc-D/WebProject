<?php
require_once 'bootstrap.php';

if (!isUserLoggedIn()) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$articoli = $dbh->getPostById(
    $_GET["id"],
    );

header('Content-Type: application/json');
echo json_encode($articoli);
?>

<!-- add session control session is passed with ajax -->