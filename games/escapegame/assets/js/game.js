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
        loadLevel(levelNumber) {
            console.log('Loading level:', levelNumber); // Debug log
            switch(levelNumber) {
                case 1:
                    this.currentLevelData = level1;
                    break;
                case 2:
                    this.currentLevelData = level2;
                    if (this.currentLevelData.mechanics.onStart) {
                        this.currentLevelData.mechanics.onStart(this);
                    }
                    break;
            }
            this.showStory = true;
            this.storyProgress = 0;
            this.currentStory = this.currentLevelData.initialStory;
            this.stats = { ...this.currentLevelData.stats };
            this.currentLevel = levelNumber;
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
                this.currentRoom = this.currentLevelData.rooms.clinic;
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
        }
    },
    watch: {
        'stats.bloodLoss'(newVal, oldVal) {
            this.updateUI();
        }
    }
}).mount('#game');
