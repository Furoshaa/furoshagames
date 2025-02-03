const { createApp } = Vue;

createApp({
    data() {
        return {
            timeLeft: 1800, // 30 minutes
            inventory: [],
            currentRoomId: 'awakening',
            examiningItem: null,
            stats: {
                health: 65,
                energy: 80,
                hasArm: false,
                hasLeg: false
            },
            rooms: {
                awakening: {
                    name: 'Illegal Cyberclinic',
                    image: 'clinic.jpg',
                    description: `You wake up in a dingy cyberclinic. Your right arm and left leg are missing. The last thing you remember is being attacked in the neon streets of Neo-Tokyo. A flickering hologram message reads: "Payment overdue - cybernetic limbs repossessed. Exit quarantine when ready."`,
                    items: [
                        { id: 'datapad', name: 'Corrupted Datapad', image: 'datapad.jpg', description: 'A damaged datapad containing fragmentary clinic records.' },
                        { id: 'syringe', name: 'Stim Syringe', image: 'syringe.jpg', description: 'A medical stimulant that could temporarily boost your system.' }
                    ],
                    exits: [
                        { to: 'corridor', label: 'Leave Clinic Room' }
                    ]
                },
                corridor: {
                    name: 'Maintenance Corridor',
                    image: 'corridor.jpg',
                    description: 'A narrow service corridor lit by malfunctioning neon tubes. You can hear mechanical whirring from the storage room.',
                    items: [
                        { id: 'keycard', name: 'Security Keycard', image: 'keycard.jpg', description: 'A high-level security keycard with Corp markings.' }
                    ],
                    exits: [
                        { to: 'awakening', label: 'Back to Clinic' },
                        { to: 'storage', label: 'Storage Room' },
                        { to: 'security', label: 'Security Room', locked: true }
                    ]
                },
                storage: {
                    name: 'Parts Storage',
                    image: 'storage.jpg',
                    description: 'Rows of cybernetic parts line the walls. Most are damaged or incompatible with your systems.',
                    items: [
                        { id: 'arm', name: 'Cybernetic Arm', image: 'arm.jpg', description: 'A military-grade cybernetic arm. Looks compatible with your system.' },
                        { id: 'hack_tool', name: 'Hacking Module', image: 'hacktool.jpg', description: 'A specialized cyberdeck for bypassing security systems.' }
                    ],
                    exits: [
                        { to: 'corridor', label: 'Back to Corridor' }
                    ]
                },
                security: {
                    name: 'Security Control',
                    image: 'security.jpg',
                    description: 'The clinic\'s security center. Multiple screens show camera feeds and system status.',
                    items: [
                        { id: 'leg', name: 'Cybernetic Leg', image: 'leg.jpg', description: 'Your missing leg, stored in a security locker.' }
                    ],
                    exits: [
                        { to: 'corridor', label: 'Back to Corridor' },
                        { to: 'exit', label: 'Exit Facility', locked: true }
                    ]
                },
                exit: {
                    name: 'Facility Exit',
                    image: 'exit.jpg',
                    description: 'The heavily secured exit of the facility. You\'ll need full mobility to escape through here.',
                    items: [],
                    exits: [
                        { to: 'security', label: 'Back to Security' }
                    ]
                }
            }
        }
    },
    computed: {
        currentRoom() {
            return this.rooms[this.currentRoomId];
        },
        isItemInInventory() {
            return this.examiningItem && this.inventory.some(item => item.id === this.examiningItem.id);
        }
    },
    mounted() {
        this.startTimer();
        this.initializeModals();
    },
    methods: {
        initializeModals() {
            this.examineModal = new bootstrap.Modal(document.getElementById('examineModal'));
            this.gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
        },
        startTimer() {
            const timer = setInterval(() => {
                if (this.timeLeft > 0 && !this.gameOver) {
                    this.timeLeft--;
                    this.updateStats();
                } else if (!this.gameOver) {
                    this.endGame(false, 'System Failure', 'Your cybernetic systems shut down completely.');
                    clearInterval(timer);
                }
            }, 1000);
        },
        updateStats() {
            if (this.timeLeft % 60 === 0) {
                this.stats.energy = Math.max(0, this.stats.energy - 5);
                if (this.stats.energy === 0) {
                    this.stats.health = Math.max(0, this.stats.health - 10);
                }
            }
        },
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        examineItem(item) {
            this.examiningItem = item;
            this.examineModal.show();
        },
        pickupExaminedItem() {
            if (this.inventory.length >= 8) {
                alert('Neural storage capacity reached!');
                return;
            }
            this.pickupItem(this.examiningItem);
            this.examineModal.hide();
        },
        pickupItem(item) {
            this.inventory.push(item);
            this.currentRoom.items = this.currentRoom.items.filter(i => i.id !== item.id);
        },
        useItem(item) {
            switch(item.id) {
                case 'arm':
                    if (!this.stats.hasArm) {
                        this.stats.hasArm = true;
                        this.stats.health += 10;
                        this.removeFromInventory(item);
                        alert('Cybernetic arm successfully installed.');
                    }
                    break;
                case 'leg':
                    if (!this.stats.hasLeg) {
                        this.stats.hasLeg = true;
                        this.stats.health += 10;
                        this.removeFromInventory(item);
                        alert('Cybernetic leg successfully installed.');
                    }
                    break;
                case 'syringe':
                    this.stats.health = Math.min(100, this.stats.health + 30);
                    this.stats.energy = Math.min(100, this.stats.energy + 40);
                    this.removeFromInventory(item);
                    break;
                case 'hack_tool':
                    if (this.currentRoomId === 'security') {
                        this.rooms.security.exits.find(e => e.to === 'exit').locked = false;
                        this.removeFromInventory(item);
                        alert('Security systems bypassed. Exit unlocked.');
                    }
                    break;
                case 'keycard':
                    if (this.currentRoomId === 'corridor') {
                        this.rooms.corridor.exits.find(e => e.to === 'security').locked = false;
                        alert('Security room unlocked.');
                    }
                    break;
            }
            this.checkWinCondition();
        },
        removeFromInventory(item) {
            this.inventory = this.inventory.filter(i => i.id !== item.id);
        },
        moveToRoom(roomId) {
            if (this.canEnterRoom(roomId)) {
                this.currentRoomId = roomId;
                this.checkWinCondition();
            }
        },
        canEnterRoom(roomId) {
            const exit = this.currentRoom.exits.find(e => e.to === roomId);
            if (exit.locked) {
                alert('Access denied. Find a way to unlock this path.');
                return false;
            }
            if (roomId === 'exit' && (!this.stats.hasArm || !this.stats.hasLeg)) {
                alert('You need both cybernetic limbs installed to escape.');
                return false;
            }
            return true;
        },
        checkWinCondition() {
            if (this.currentRoomId === 'exit' && this.stats.hasArm && this.stats.hasLeg) {
                this.endGame(true, 'Freedom Achieved', 'You successfully escaped the facility with your recovered cybernetics.');
            }
        },
        endGame(won, title, message) {
            this.gameOverTitle = title;
            this.gameOverMessage = message;
            this.gameOver = true;
            this.gameOverModal.show();
        },
        restartGame() {
            location.reload();
        }
    }
}).mount('#game');
