-- Création de la base de données
CREATE DATABASE IF NOT EXISTS furoshagames;
USE furoshagames;

-- Table des utilisateurs
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de progression du RPG
CREATE TABLE rpg_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    health INT DEFAULT 100,
    gold INT DEFAULT 0,
    current_location VARCHAR(100) DEFAULT 'Début',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table de l'inventaire RPG
CREATE TABLE rpg_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table de progression de l'Escape Game
CREATE TABLE escape_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    current_room VARCHAR(100) DEFAULT 'Entrée',
    solved_puzzles TEXT,
    time_spent INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
