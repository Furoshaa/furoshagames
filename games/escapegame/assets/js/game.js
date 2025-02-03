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
            isGameOver: false
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
            this.feedbackModal.show();
        },
        closeFeedback() {
            this.feedbackModal.hide();
            if (this.isGameOver) {
                this.resetGame();
            }
        },
        progressStory() {
            if (this.storyProgress < this.currentLevelData.story.length - 1) {
                this.storyProgress++;
                this.currentStory = this.currentLevelData.story[this.storyProgress];
            } else {
                this.showStory = false;
                this.currentRoom = this.currentLevelData.rooms.clinic;
                // Let the level handle its own mechanics
                this.currentLevelData.mechanics.onRoomEnter(this);
            }
        },
        interact(hotspot) {
            if (typeof hotspot.action === 'function') {
                hotspot.action(this);
            }
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
        }
    },
    watch: {
        'stats.bloodLoss'(newVal, oldVal) {
            this.updateUI();
        }
    }
}).mount('#game');
