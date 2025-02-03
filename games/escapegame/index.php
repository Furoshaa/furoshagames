<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Station Escape</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-dark text-light">
    <div id="game" class="container my-4">
        <div class="row mb-4">
            <div class="col">
                <h1 class="text-center">Space Station Escape</h1>
                <div class="d-flex justify-content-between">
                    <div>Room: {{ currentRoom.name }}</div>
                    <div>Time Left: {{ formatTime(timeLeft) }}</div>
                    <div>Items: {{ inventory.length }}/5</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="game-screen p-4 border rounded mb-3">
                    <p class="mb-4">{{ currentRoom.description }}</p>
                    <div class="room-items mb-4" v-if="currentRoom.items.length">
                        <h5>Items in room:</h5>
                        <button 
                            v-for="item in currentRoom.items" 
                            :key="item.id"
                            @click="pickupItem(item)"
                            class="btn btn-outline-light me-2 mb-2">
                            {{ item.name }}
                        </button>
                    </div>
                    <div class="room-exits">
                        <h5>Exits:</h5>
                        <button 
                            v-for="exit in currentRoom.exits" 
                            :key="exit.to"
                            @click="moveToRoom(exit.to)"
                            class="btn btn-primary me-2">
                            {{ exit.label }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="inventory p-3 border rounded">
                    <h4>Inventory</h4>
                    <div v-if="inventory.length === 0" class="text-muted">
                        No items collected
                    </div>
                    <div v-for="item in inventory" :key="item.id" class="mb-2">
                        <button 
                            class="btn btn-secondary w-100"
                            @click="useItem(item)">
                            {{ item.name }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Game Over Modal -->
        <div class="modal fade" id="gameOverModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title">{{ gameOverTitle }}</h5>
                    </div>
                    <div class="modal-body">
                        <p>{{ gameOverMessage }}</p>
                    </div>
                    <div class="modal-footer border-secondary">
                        <button @click="restartGame" class="btn btn-primary">Play Again</button>
                        <a href="../index.php" class="btn btn-secondary">Main Menu</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="game.js"></script>
</body>
</html>
