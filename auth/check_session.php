<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    echo json_encode([
        'success' => true,
        'isLoggedIn' => true,
        'username' => $_SESSION['username']
    ]);
} else {
    echo json_encode([
        'success' => true,
        'isLoggedIn' => false
    ]);
}
