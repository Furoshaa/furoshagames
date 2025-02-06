const { createApp } = Vue;

createApp({
    data() {
        return {
            showStory: true,
            currentLevel: 1,
            currentLevelData: level1,
            stats: { ...level1.stats },
            feedback: {
                title: '',
                message: '',
                buttonText: ''
            },
            currentStory: level1.initialStory,
            currentRoom: null,
            storyProgress: 0,
            isGameOver: false,
            keypadInput: '',
            keypadConfig: null,
            hackingGrid: [],
            hackingTarget: [],
            hackingSequence: [],
            lastSelectedCell: null,
            playerHealth: 100,
            enemyHealth: 100,
            combatState: null,
            emailContent: ''
        }
    },
    mounted() {
        this.initializeModals();
    },
    methods: {
        initializeLevel() {
            this.stats = {...this.currentLevelData.stats};
            this.currentStory = this.currentLevelData.initialStory;
        },
        initializeModals() {
            this.feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
        },
        showFeedback(title, message, buttonText = 'Continue') {
            this.feedback = { title, message, buttonText };
            if (!this.feedbackModal) {
                this.feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
            }
            this.feedbackModal.show();
        },
        closeFeedback() {
            this.feedbackModal.hide();
            if (this.isGameOver) {
                this.resetGame();
            }
        },
        loadLevel(levelNumber) {
            console.log('Loading level:', levelNumber); // Debug log
            // Store current inventory before loading new level
            const currentInventory = this.stats.inventory || [];
            
            switch(levelNumber) {
                case 1:
                    this.currentLevelData = level1;
                    break;
                case 2:
                    this.currentLevelData = level2;
                    break;
                case 3:
                    this.currentLevelData = level3;
                    break;
                case 4:
                    this.currentLevelData = level4;
                    break;
                case 5:
                    this.currentLevelData = level5;
                    break;
                case 6:
                    this.currentLevelData = level6;
                    break;
            }
            
            // Initialize stats but preserve inventory
            const newStats = { ...this.currentLevelData.stats };
            newStats.inventory = currentInventory;
            this.stats = newStats;

            this.showStory = true;
            this.storyProgress = 0;
            this.currentStory = this.currentLevelData.initialStory;
            this.currentRoom = null;  // Reset room
            this.currentLevel = levelNumber;

            // Call onStart after initialization
            if (this.currentLevelData.mechanics.onStart) {
                this.currentLevelData.mechanics.onStart(this);
            }
        },
        progressStory() {
            // For procedure story
            if (this.currentStory && this.currentStory.isProcedure) {
                console.log('In procedure:', this.currentStory.title);
                const nextIndex = this.storyProgress + 1;
                
                if (nextIndex < this.currentLevelData.procedureStory.length) {
                    this.storyProgress = nextIndex;
                    this.currentStory = this.currentLevelData.procedureStory[nextIndex];
                } else {
                    this.loadLevel(2);
                }
                return;
            }

            // Normal story progression
            if (this.storyProgress < this.currentLevelData.story.length - 1) {
                this.storyProgress++;
                this.currentStory = this.currentLevelData.story[this.storyProgress];
            } else {
                this.showStory = false;
                // Use the first room defined in the level
                const firstRoomKey = Object.keys(this.currentLevelData.rooms)[0];
                this.currentRoom = this.currentLevelData.rooms[firstRoomKey];
                
                if (this.currentLevelData.mechanics.onRoomEnter) {
                    this.currentLevelData.mechanics.onRoomEnter(this);
                }
            }
        },
        interact(hotspot) {
            if (typeof hotspot.action === 'function') {
                hotspot.action(this);
            }
        },
        changeRoom(roomKey) {
            this.currentRoom = this.currentLevelData.rooms[roomKey];
            this.updateUI();
        },
        gameOver(title, message) {
            this.isGameOver = true;
            this.showFeedback(title, message, 'Try Again');
        },
        resetGame() {
            this.showStory = true;
            this.storyProgress = 0;
            this.currentStory = this.currentLevelData.initialStory;
            this.stats = { ...this.currentLevelData.stats };
            this.currentRoom = null;
            this.isGameOver = false;
            this.currentLevelData.mechanics.onReset(this);
        },
        updateUI() {
            this.$forceUpdate();
        },

        // Keypad methods
        initializeKeypad(config) {
            this.keypadInput = '';
            this.keypadConfig = config;
            const keypadModal = new bootstrap.Modal(document.getElementById('keypadModal'));
            keypadModal.show();
        },

        enterKeypadDigit(digit) {
            if (this.keypadInput.length < 4) {
                this.keypadInput += digit;
            }
        },

        clearKeypad() {
            this.keypadInput = '';
        },

        submitKeypad() {
            const isCorrect = this.keypadInput === this.keypadConfig.correctCode;
            const modal = bootstrap.Modal.getInstance(document.getElementById('keypadModal'));
            modal.hide();
            
            if (isCorrect) {
                this.keypadConfig.onSuccess();
            } else {
                this.keypadConfig.onFailure();
            }
        },

        // Hacking minigame methods
        initializeHacking(config) {
            this.hackingGrid = config.grid;
            this.hackingTarget = config.target;
            this.hackingSequence = [];
            this.lastSelectedCell = null;
            this.hackingConfig = config;
            const hackingModal = new bootstrap.Modal(document.getElementById('hackingModal'));
            hackingModal.show();
        },

        selectHackingCell(row, col) {
            const cell = this.hackingGrid[row][col];
            this.hackingSequence.push(cell);
            this.lastSelectedCell = { row, col };

            if (this.hackingSequence.length === this.hackingTarget.length) {
                const isCorrect = this.hackingSequence.every(
                    (val, idx) => val === this.hackingTarget[idx]
                );
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('hackingModal'));
                modal.hide();

                if (isCorrect) {
                    this.hackingConfig.onSuccess();
                } else {
                    this.hackingConfig.onFailure();
                }
            }
        },

        isHackingCellSelectable(row, col) {
            if (!this.lastSelectedCell) return true;
            return row === this.lastSelectedCell.row || col === this.lastSelectedCell.col;
        },

        isHackingCellSelected(row, col) {
            return this.hackingSequence.includes(this.hackingGrid[row][col]);
        },

        // Combat system methods
        initializeCombat(config) {
            this.playerHealth = 100;
            this.enemyHealth = 100;
            this.combatState = config;
            const combatModal = new bootstrap.Modal(document.getElementById('combatModal'));
            combatModal.show();
        },

        executeCombatMove(moveType) {
            let playerDamage = 0;
            let enemyDamage = 0;

            // Calculate damages based on move type
            switch(moveType) {
                case 'quick':
                    playerDamage = Math.floor(Math.random() * 15) + 5;
                    enemyDamage = Math.floor(Math.random() * 20) + 5;
                    break;
                case 'heavy':
                    playerDamage = Math.floor(Math.random() * 25) + 10;
                    enemyDamage = Math.floor(Math.random() * 30) + 10;
                    break;
                case 'parry':
                    playerDamage = Math.floor(Math.random() * 10);
                    enemyDamage = Math.floor(Math.random() * 5);
                    break;
            }

            this.enemyHealth = Math.max(0, this.enemyHealth - playerDamage);
            this.playerHealth = Math.max(0, this.playerHealth - enemyDamage);

            if (this.enemyHealth <= 0 || this.playerHealth <= 0) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('combatModal'));
                modal.hide();

                if (this.enemyHealth <= 0) {
                    this.combatState.onVictory();
                } else {
                    this.combatState.onDefeat();
                }
            }
        },

        showEmailTerminal(content) {
            this.emailContent = content;
            const emailModal = new bootstrap.Modal(document.getElementById('emailModal'));
            emailModal.show();
        }
    },
    watch: {
        'stats.bloodLoss'(newVal, oldVal) {
            this.updateUI();
        }
    }
}).mount('#game');
