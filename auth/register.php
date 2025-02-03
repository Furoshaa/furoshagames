<?php
// Start output buffering
ob_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    require_once '../db_connexion.php';

    // Get JSON input
    $jsonInput = file_get_contents('php://input');
    if (!$jsonInput) {
        throw new Exception('No input received');
    }

    $data = json_decode($jsonInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }

    if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
        throw new Exception('Please fill all fields');
    }

    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Check if email exists
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        throw new Exception('Email already registered');
    }

    // Check if username exists
    $stmt = $db->prepare('SELECT id FROM users WHERE username = ?');
    $stmt->execute([$data['username']]);
    if ($stmt->fetch()) {
        throw new Exception('Username already taken');
    }

    // Insert new user
    $stmt = $db->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([
        $data['username'],
        $data['email'],
        password_hash($data['password'], PASSWORD_DEFAULT)
    ]);

    // Clean any output that might have been generated
    ob_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Registration successful']);

} catch (Exception $e) {
    // Clean any output that might have been generated
    ob_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
exit;
