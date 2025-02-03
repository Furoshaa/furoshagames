const { createApp } = Vue;

createApp({
    data() {
        return {
            showStory: true,
            currentLevel: 1,
            stats: {
                health: 45,
                bloodLoss: 75,
                energy: 60,
                hasArmLink: false,
                hasLegLink: false
            },
            feedback: {
                title: '',
                message: '',
                buttonText: ''
            },
            currentStory: level1.initialStory,
            currentRoom: null,
            storyProgress: 0,
            bloodLossTimer: null,
            isGameOver: false
        }
    },
    mounted() {
        this.initializeModals();
    },
    methods: {
        initializeModals() {
            this.feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
        },
        showFeedback(title, message, buttonText = 'Continue') {
            this.feedback = { title, message, buttonText };
            this.feedbackModal.show();
        },
        closeFeedback() {
            this.feedbackModal.hide();
            if (this.isGameOver) {
                this.resetGame();
            }
        },
        progressStory() {
            if (this.storyProgress < level1.story.length - 1) {
                this.storyProgress++;
                this.currentStory = level1.story[this.storyProgress];
            } else {
                this.showStory = false;
                this.currentRoom = level1.rooms.clinic;
                this.startBloodLossTimer();
                this.gameStarted = true;
            }
        },
        interact(hotspot) {
            if (typeof hotspot.action === 'function') {
                hotspot.action(this);
            }
        },
        startBloodLossTimer() {
            if (this.bloodLossTimer) {
                clearInterval(this.bloodLossTimer);
            }
            
            this.bloodLossTimer = setInterval(() => {
                if (!this.stats.hasArmLink && !this.isGameOver) {
                    this.stats.bloodLoss = Math.min(100, this.stats.bloodLoss + 1);
                    
                    if (this.stats.bloodLoss >= 100) {
                        this.gameOver('Critical System Failure', 'Blood loss reached critical levels. Emergency shutdown initiated.');
                    }
                }
            }, 1000);  // Changed from 5000 to 1000 to update every second
        },
        gameOver(title, message) {
            if (this.bloodLossTimer) {
                clearInterval(this.bloodLossTimer);
            }
            this.isGameOver = true;
            this.showFeedback(title, message, 'Try Again');
        },
        startTimer() {
            this.timer = setInterval(() => {
                if (this.timeLeft > 0 && !this.gameOver) {
                    this.timeLeft--;
                    this.updateStats();
                } else if (!this.gameOver) {
                    this.endGame(false, 'System Failure', 'Your cybernetic systems shut down completely.');
                    clearInterval(this.timer);
                }
            }, 1000);
        },
        resetGame() {
            this.showStory = true;
            this.storyProgress = 0;
            this.currentStory = level1.initialStory;
            
            this.stats.health = 45;
            this.stats.bloodLoss = 75;
            this.stats.energy = 60;
            this.stats.hasArmLink = false;
            this.stats.hasLegLink = false;
            
            this.currentRoom = null;
            this.isGameOver = false;
            
            if (this.bloodLossTimer) {
                clearInterval(this.bloodLossTimer);
                this.bloodLossTimer = null;
            }
        }
    }
}).mount('#game');
