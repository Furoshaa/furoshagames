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

        <!-- Keypad Modal -->
        <div class="modal fade" id="keypadModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content cyber-modal">
                    <div class="modal-header">
                        <h5 class="modal-title neon-text">Security Keypad</h5>
                    </div>
                    <div class="modal-body">
                        <div class="keypad-display mb-3 p-2 bg-dark">
                            <span class="cyber-text">{{ keypadInput }}</span>
                        </div>
                        <div class="keypad-grid">
                            <button v-for="n in 9" :key="n" @click="enterKeypadDigit(n)" 
                                    class="btn cyber-btn m-1">{{ n }}</button>
                            <button @click="enterKeypadDigit(0)" class="btn cyber-btn m-1">0</button>
                            <button @click="clearKeypad" class="btn cyber-btn m-1">C</button>
                            <button @click="submitKeypad" class="btn cyber-btn m-1">✓</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hacking Minigame Modal -->
        <div class="modal fade" id="hackingModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content cyber-modal">
                    <div class="modal-header">
                        <h5 class="modal-title neon-text">System Breach Protocol</h5>
                    </div>
                    <div class="modal-body">
                        <div class="hack-grid mb-3">
                            <div v-for="(row, i) in hackingGrid" :key="i" class="hack-row">
                                <button v-for="(cell, j) in row" :key="j"
                                        @click="selectHackingCell(i, j)"
                                        :class="['btn cyber-btn m-1', {'selected': isHackingCellSelected(i, j)}]"
                                        :disabled="!isHackingCellSelectable(i, j)">
                                    {{ cell }}
                                </button>
                            </div>
                        </div>
                        <div class="target-sequence mb-3">
                            Target: <span class="cyber-text">{{ hackingTarget.join(' ') }}</span>
                        </div>
                        <div class="current-sequence">
                            Current: <span class="cyber-text">{{ hackingSequence.join(' ') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Combat Modal -->
        <div class="modal fade" id="combatModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content cyber-modal">
                    <div class="modal-header">
                        <h5 class="modal-title neon-text">Combat System</h5>
                    </div>
                    <div class="modal-body">
                        <div class="combat-status mb-3">
                            <div class="health-bar mb-2">
                                Player HP: {{ playerHealth }}%
                                <div class="progress">
                                    <div class="progress-bar bg-success" :style="{ width: playerHealth + '%' }"></div>
                                </div>
                            </div>
                            <div class="health-bar mb-3">
                                Enemy HP: {{ enemyHealth }}%
                                <div class="progress">
                                    <div class="progress-bar bg-danger" :style="{ width: enemyHealth + '%' }"></div>
                                </div>
                            </div>
                        </div>
                        <div class="combat-controls">
                            <button @click="executeCombatMove('quick')" class="btn cyber-btn m-1">Quick Strike</button>
                            <button @click="executeCombatMove('heavy')" class="btn cyber-btn m-1">Heavy Attack</button>
                            <button @click="executeCombatMove('parry')" class="btn cyber-btn m-1">Parry</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Email Modal (Extra Large) -->
        <div class="modal fade" id="emailModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-lg-down">
                <div class="modal-content cyber-modal">
                    <div class="modal-header">
                        <h5 class="modal-title neon-text">Computer Terminal</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body email-content">
                        <div class="terminal-interface" v-html="emailContent"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn cyber-btn" data-bs-dismiss="modal">Close Terminal</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script src="assets/js/levels/level1.js?v=1"></script>
    <script src="assets/js/levels/level2.js?v=1"></script>
    <script src="assets/js/levels/level3.js?v=1"></script>
    <script src="assets/js/levels/level4.js?v=1"></script>
    <script src="assets/js/levels/level5.js?v=1"></script>
    <script src="assets/js/levels/level6.js?v=1"></script>
    <script src="assets/js/game.js?v=1"></script>
</body>
</html>
