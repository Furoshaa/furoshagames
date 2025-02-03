<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cyberpunk Awakening</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/main.css" rel="stylesheet">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vuedraggable@4.1.0/dist/vuedraggable.umd.min.js"></script>
</head>
<body class="bg-dark text-light cyberpunk">
    <div id="game" class="container-fluid p-4">
        <div class="row mb-4">
            <div class="col">
                <h1 class="text-center neon-text">Cyberpunk Awakening</h1>
                <div class="stats-panel p-2 mb-3">
                    <div class="d-flex justify-content-between">
                        <div class="stat-item">Location: <span class="neon-text">{{ currentRoom.name }}</span></div>
                        <div class="stat-item">System Integrity: <span class="neon-text">{{ stats.health }}%</span></div>
                        <div class="stat-item">Power Level: <span class="neon-text">{{ stats.energy }}%</span></div>
                        <div class="stat-item">Time Left: <span class="neon-text">{{ formatTime(timeLeft) }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="game-screen p-3 mb-3">
                    <div class="room-image mb-3">
                        <img :src="'assets/images/rooms/' + currentRoom.image" class="img-fluid rounded">
                    </div>
                    <div class="description-panel p-3 mb-3">
                        <p v-html="currentRoom.description" class="cyber-text"></p>
                    </div>
                    
                    <div class="interaction-panel">
                        <div class="room-items mb-4" v-if="currentRoom.items.length">
                            <h5 class="neon-text">Available Items:</h5>
                            <div class="d-flex flex-wrap gap-2">
                                <div v-for="item in currentRoom.items" 
                                     :key="item.id"
                                     class="item-card"
                                     @click="examineItem(item)">
                                    <img :src="'assets/images/items/' + item.image" class="item-image">
                                    <span class="item-name">{{ item.name }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="room-exits">
                            <h5 class="neon-text">Navigation:</h5>
                            <div class="d-flex flex-wrap gap-2">
                                <button v-for="exit in currentRoom.exits" 
                                        :key="exit.to"
                                        @click="moveToRoom(exit.to)"
                                        :class="['btn', 'cyber-btn', {'locked': exit.locked}]"
                                        :disabled="exit.locked">
                                    {{ exit.label }}
                                    <i v-if="exit.locked" class="fas fa-lock"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="character-panel p-3 mb-3">
                    <h4 class="neon-text">Augmentation Status</h4>
                    <div class="cybernetic-status">
                        <div class="body-part" :class="{ 'missing': !stats.hasArm }">Right Arm</div>
                        <div class="body-part" :class="{ 'missing': !stats.hasLeg }">Left Leg</div>
                        <div class="body-part" :class="{ 'damaged': stats.health < 50 }">Core System</div>
                    </div>
                </div>

                <div class="inventory-panel p-3">
                    <h4 class="neon-text">Neural Storage ({{ inventory.length }}/8)</h4>
                    <draggable 
                        v-model="inventory" 
                        class="inventory-grid"
                        :options="{ group: 'items' }">
                        <div v-for="item in inventory" 
                             :key="item.id"
                             class="inventory-item"
                             @click="useItem(item)"
                             @contextmenu.prevent="examineItem(item)">
                            <img :src="'assets/images/items/' + item.image" :alt="item.name">
                            <span class="item-name">{{ item.name }}</span>
                        </div>
                    </draggable>
                </div>
            </div>
        </div>

        <!-- Item Examination Modal -->
        <div class="modal fade" id="examineModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content cyber-modal">
                    <div class="modal-header">
                        <h5 class="modal-title neon-text">{{ examiningItem?.name || '' }}</h5>
                        <button type="button" class="btn-close neon-text" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img :src="'assets/images/items/' + examiningItem?.image" 
                                     class="img-fluid rounded">
                            </div>
                            <div class="col-md-8">
                                <p class="cyber-text">{{ examiningItem?.description }}</p>
                                <div class="item-actions mt-3">
                                    <button @click="pickupExaminedItem" 
                                            class="btn cyber-btn"
                                            v-if="!isItemInInventory">
                                        Upload to Neural Storage
                                    </button>
                                    <button @click="useExaminedItem" 
                                            class="btn cyber-btn"
                                            v-else>
                                        Use Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Game Over Modal -->
        <div class="modal fade" id="gameOverModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content cyber-modal">
                    <div class="modal-header">
                        <h5 class="modal-title neon-text">{{ gameOverTitle }}</h5>
                    </div>
                    <div class="modal-body cyber-text">
                        <p>{{ gameOverMessage }}</p>
                    </div>
                    <div class="modal-footer">
                        <button @click="restartGame" class="btn cyber-btn">Reboot System</button>
                        <a href="../index.php" class="btn cyber-btn-secondary">Exit Simulation</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="assets/game.js"></script>
</body>
</html>
