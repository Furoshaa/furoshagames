const { createApp } = Vue;

createApp({
    data() {
        return {
            timeLeft: 600, // 10 minutes in seconds
            inventory: [],
            currentRoomId: 'start',
            gameOver: false,
            gameOverTitle: '',
            gameOverMessage: '',
            rooms: {
                start: {
                    name: 'Control Room',
                    description: 'You wake up in the control room of a space station. Emergency lights are flashing. The station\'s AI announces: "Warning: Station critical failure. Evacuation required."',
                    items: [
                        { id: 'keycard', name: 'Keycard', description: 'A security keycard' },
                        { id: 'tablet', name: 'Tablet', description: 'A damaged tablet showing station schematics' }
                    ],
                    exits: [
                        { to: 'corridor', label: 'Enter Corridor' }
                    ]
                },
                corridor: {
                    name: 'Main Corridor',
                    description: 'A long corridor with flickering lights. You can hear the hum of failing life support systems.',
                    items: [
                        { id: 'oxygen', name: 'Oxygen Tank', description: 'Emergency oxygen supply' }
                    ],
                    exits: [
                        { to: 'start', label: 'Back to Control Room' },
                        { to: 'lab', label: 'Enter Lab' },
                        { to: 'escape', label: 'Escape Pod Bay', locked: true }
                    ]
                },
                lab: {
                    name: 'Research Lab',
                    description: 'The lab is a mess of broken equipment. Something went terribly wrong here.',
                    items: [
                        { id: 'password', name: 'Password Note', description: 'A note with the escape pod override code' },
                        { id: 'battery', name: 'Power Cell', description: 'Emergency power cell' }
                    ],
                    exits: [
                        { to: 'corridor', label: 'Back to Corridor' }
                    ]
                },
                escape: {
                    name: 'Escape Pod Bay',
                    description: 'The escape pod is ready. You need to power it up and enter the override code.',
                    items: [],
                    exits: [
                        { to: 'corridor', label: 'Back to Corridor' }
                    ]
                }
            }
        }
    },
    computed: {
        currentRoom() {
            return this.rooms[this.currentRoomId];
        }
    },
    mounted() {
        this.startTimer();
    },
    methods: {
        startTimer() {
            const timer = setInterval(() => {
                if (this.timeLeft > 0 && !this.gameOver) {
                    this.timeLeft--;
                } else if (!this.gameOver) {
                    this.endGame(false, 'Time\'s Up!', 'The station exploded before you could escape.');
                    clearInterval(timer);
                }
            }, 1000);
        },
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        pickupItem(item) {
            if (this.inventory.length >= 5) {
                alert('Inventory full! (Max 5 items)');
                return;
            }
            this.inventory.push(item);
            this.currentRoom.items = this.currentRoom.items.filter(i => i.id !== item.id);
        },
        useItem(item) {
            if (this.currentRoomId === 'escape') {
                if (this.hasRequiredItems()) {
                    this.endGame(true, 'Congratulations!', 'You successfully escaped the station!');
                } else {
                    alert('You need the keycard, power cell, and password to escape!');
                }
            }
            // Other item usage logic can be added here
        },
        moveToRoom(roomId) {
            if (roomId === 'escape' && !this.hasKeycard()) {
                alert('You need a keycard to enter this area!');
                return;
            }
            this.currentRoomId = roomId;
        },
        hasKeycard() {
            return this.inventory.some(item => item.id === 'keycard');
        },
        hasRequiredItems() {
            const requiredItems = ['keycard', 'battery', 'password'];
            return requiredItems.every(itemId => 
                this.inventory.some(item => item.id === itemId)
            );
        },
        endGame(won, title, message) {
            this.gameOver = true;
            this.gameOverTitle = title;
            this.gameOverMessage = message;
            const modal = new bootstrap.Modal(document.getElementById('gameOverModal'));
            modal.show();
        },
        restartGame() {
            location.reload();
        }
    }
}).mount('#game');
