<?php
require_once '../db_connexion.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$response = ['success' => false, 'message' => ''];

if (!empty($data['email']) && !empty($data['password'])) {
    $stmt = $db->prepare('SELECT id, username, password_hash FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if ($user && password_verify($data['password'], $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $response = ['success' => true, 'message' => 'Login successful'];
    } else {
        $response['message'] = 'Invalid credentials';
    }
} else {
    $response['message'] = 'Please fill all fields';
}

header('Content-Type: application/json');
echo json_encode($response);
