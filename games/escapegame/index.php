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
    <!-- Updated navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
        <div class="container d-flex justify-content-between align-items-center">
            <a class="navbar-brand" href="../../index.php">Furosha's Games</a>
            <div class="mx-auto">
                <h5 class="mb-0 neon-text">Cyberpunk Awakening</h5>
            </div>
            <a href="../../index.php" class="btn btn-outline-light">Main Menu</a>
        </div>
    </nav>

    <!-- Auth check -->
    <?php
    session_start();
    if (!isset($_SESSION['user_id'])) {
        header('Location: ../../index.php');
        exit();
    }
    ?>

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
            <div class="row">
                <!-- Main Game Area -->
                <div class="col-md-8">
                    <div class="game-screen p-3">
                        <div class="room-view position-relative">
                            <img :src="currentRoom.background" class="img-fluid room-bg">
                            <div v-for="hotspot in currentRoom.hotspots" 
                                 :key="hotspot.id"
                                 :class="['interaction-spot', hotspot.class]"
                                 :style="hotspot.style"
                                 @click="interact(hotspot)">
                                <img v-if="hotspot.image" :src="hotspot.image" style="width: 100%; height: 100%; object-fit: contain;">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Level-specific Right Panel -->
                <div class="col-md-4">
                    <div v-if="!showStory" v-html="currentLevelData.ui.rightPanel.render(this)"></div>
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
