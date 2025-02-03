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
</head>
<body class="bg-dark text-light cyberpunk">
    <div id="game" class="container-fluid p-4">
        <!-- Story Panel -->
        <div v-if="showStory" class="story-panel">
            <div class="story-content p-4">
                <h2 class="neon-text mb-4">{{ currentStory.title }}</h2>
                <div class="cyber-text mb-4" v-html="currentStory.content"></div>
                <button @click="progressStory" class="btn cyber-btn float-end">
                    {{ currentStory.buttonText || 'Continue' }}
                </button>
            </div>
        </div>

        <!-- Game Interface -->
        <div v-else>
            <!-- Stats Bar -->
            <div class="row mb-4">
                <div class="col">
                    <div class="stats-panel p-2">
                        <div class="d-flex justify-content-between">
                            <div class="stat-item">System Integrity: 
                                <span class="neon-text">{{ stats.health }}%</span>
                            </div>
                            <div class="stat-item danger-text">Blood Loss: 
                                <span>{{ stats.bloodLoss }}%</span>
                            </div>
                            <div class="stat-item">Power: 
                                <span class="neon-text">{{ stats.energy }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Game Area -->
            <div class="row">
                <div class="col-md-8">
                    <div class="game-screen p-3">
                        <div class="room-view position-relative">
                            <img :src="currentRoom.background" class="img-fluid room-bg">
                            <div v-for="hotspot in currentRoom.hotspots" 
                                 :key="hotspot.id"
                                 :class="['interaction-spot', hotspot.class]"
                                 :style="hotspot.style"
                                 @click="interact(hotspot)">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inventory/Status Panel -->
                <div class="col-md-4">
                    <div class="cyber-panel p-3">
                        <h4 class="neon-text mb-3">System Status</h4>
                        <div class="status-grid">
                            <div class="status-item" :class="{ 'damaged': !stats.hasArmLink }">
                                Right Arm Connection Port
                            </div>
                            <div class="status-item" :class="{ 'damaged': !stats.hasLegLink }">
                                Left Leg Connection Port
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Feedback Modal -->
        <div class="modal fade" id="feedbackModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content cyber-modal">
                    <div class="modal-header">
                        <h5 class="modal-title neon-text">{{ feedback.title }}</h5>
                    </div>
                    <div class="modal-body cyber-text">
                        <p v-html="feedback.message"></p>
                    </div>
                    <div class="modal-footer">
                        <button @click="closeFeedback" class="btn cyber-btn">
                            {{ feedback.buttonText || 'Continue' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/js/levels/level1.js"></script>
    <script src="assets/js/game.js"></script>
</body>
</html>
