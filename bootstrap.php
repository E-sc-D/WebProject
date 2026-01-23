<?php
session_start();

require_once("functions.php");
require_once("database.php");

$dbh = new DatabaseHelper("localhost", "root", "", "spotted", 3306);

?>