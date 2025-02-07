<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../db_connexion.php';

if (isset($_SESSION['user_id']) && isset($_POST['chosen_ending'])) {
    try {
        // Debug logs
        error_log("Session user_id: " . $_SESSION['user_id']);
        error_log("Session username: " . $_SESSION['username']);
        error_log("Chosen ending: " . $_POST['chosen_ending']);
        
        $stmt = $db->prepare("INSERT INTO gameplay_records 
            (user_id, username, game_name, completion_time, chosen_ending) 
            VALUES 
            (:uid, :uname, :game, :time, :ending)");

        $result = $stmt->execute([
            ':uid' => $_SESSION['user_id'],
            ':uname' => $_SESSION['username'],
            ':game' => 'Cyberpunk Awakening',
            ':time' => isset($_SESSION['game_start_time']) ? time() - $_SESSION['game_start_time'] : 0,
            ':ending' => $_POST['chosen_ending']
        ]);

        if ($result) {
            error_log("Record saved successfully");
            // Au lieu de rediriger, on retourne à la page avec un paramètre spécial
            header("Location: index.php?showEnding=" . urlencode($_POST['chosen_ending']));
            exit();
        } else {
            error_log("Failed to save record");
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        echo "Error: " . $e->getMessage();
    }
} else {
    error_log("Missing required data - user_id: " . isset($_SESSION['user_id']) . 
              ", chosen_ending: " . isset($_POST['chosen_ending']));
}

// Si on arrive ici, c'est qu'il y a eu une erreur
header("Location: ../../index.php");
exit();
