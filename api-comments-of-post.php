<?php
require_once 'bootstrap.php';

if (!isUserLoggedIn()) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$articoli = $dbh->getCommentsByPost(
    $_GET["post_id"],
    $_GET["order"],
    );

header('Content-Type: application/json');
echo json_encode($articoli);
?>