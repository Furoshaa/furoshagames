const level6 = {
    initialStory: {
        title: 'Final Confrontation',
        content: `Vale lies at your feet, bleeding from where your mantis blade pierced the door. 
        His augmented guards are disabled, and you finally have him cornered.<br><br>
        <div class="system-status">
            <span class="cyber-text">FINAL OBJECTIVES:<br>
            - Confront Marcus Vale<br>
            - Choose his fate<br>
            - Escape Nemesis Tower</span>
        </div>`,
        buttonText: 'Approach Vale'
    },
    story: [
        {
            title: 'The Truth',
            content: `"You were getting too close," Vale gasps, clutching his wound. "The black market 
            cyber-trade, the missing people, the illegal experiments... you were going to expose everything. 
            I couldn't let that happen."`,
            buttonText: 'Continue'
        }
    ],
    stats: {
        inventory: [
            {
                id: 'cyberarm_mantis',
                name: 'Cyber-Arm with Mantis Blades',
                image: 'assets/images/items/cyberarm_mantis.png',
                description: 'Military-grade cyber-arm enhanced with deadly mantis blades.',
                type: 'equipped',
                abilities: ['strength', 'combat']
            },
            {
                id: 'cyberleg',
                name: 'Military Grade Cyber-Leg',
                image: 'assets/images/items/cyberleg.png',
                description: 'Enhanced mobility and jump capability.',
                type: 'equipped',
                abilities: ['jump']
            },
            {
                id: 'evidence',
                name: 'Corporate Crimes Evidence',
                image: 'assets/images/items/evidence.png',
                description: 'Proof of Vale\'s illegal operations.',
                type: 'data'
            }
        ],
        ending: null,
        alarmTriggered: false
    },
    ui: {
        rightPanel: {
            render(game) {
                return `
                    <div class="cyber-panel p-3">
                        <h4 class="neon-text mb-3">Inventory</h4>
                        <div class="inventory-grid">
                            ${game.stats.inventory.map(item => `
                                <div class="inventory-item ${item.type}" onclick="window.gameApp.examineItem('${item.id}')">
                                    <img src="${item.image}" alt="${item.name}" class="item-image">
                                    <div class="item-name">${item.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }
    },
    rooms: {
        valeConfrontation: {
            background: 'assets/images/rooms/panic_room.jpg',
            hotspots: [
                {
                    id: 'vale',
                    class: 'character clickable-image',
                    style: {
                        left: '40%',
                        top: '30%',
                        width: '20%',
                        height: '50%'
                    },
                    image: 'assets/images/characters/vale_wounded.png',
                    action: (game) => {
                        game.showFeedback(
                            'Choose Vale\'s Fate',
                            `What will you do with Vale?<br><br>
                            1. Kill him - Quick justice for what he did to you<br>
                            2. Spare him - Turn him and the evidence over to authorities<br>
                            3. Blackmail - Use the evidence to take control of Nemesis Corp`,
                            'Choose'
                        );
                        // Add choice buttons to modal
                        const modal = document.querySelector('.modal-footer');
                        modal.innerHTML = `
                            <button class="btn cyber-btn me-2" onclick="level6.mechanics.chooseEnding(1)">Execute</button>
                            <button class="btn cyber-btn me-2" onclick="level6.mechanics.chooseEnding(2)">Arrest</button>
                            <button class="btn cyber-btn" onclick="level6.mechanics.chooseEnding(3)">Control</button>
                        `;
                    }
                },
                {
                    id: 'alarm',
                    class: 'terminal clickable-image',
                    style: {
                        left: '10%',
                        top: '40%',
                        width: '15%',
                        height: '20%'
                    },
                    image: 'assets/images/items/alarm.png',
                    action: (game) => {
                        if (!game.stats.alarmTriggered) {
                            game.stats.alarmTriggered = true;
                            game.showFeedback(
                                'Warning',
                                'Building security has been alerted. You need to make your choice quickly!'
                            );
                        }
                    }
                }
            ]
        }
    },
    endings: {
        1: {
            title: 'Swift Justice',
            content: `Your mantis blade flashes once. Vale's body slumps to the floor. Justice has been served, 
            but at what cost? The evidence dies with him, and his corporation's crimes may never come to light.
            <br><br>You disappear into the neon-lit streets, a ghost in the machine.`,
            buttonText: 'Game Complete'
        },
        2: {
            title: 'Justice Served',
            content: `Corporate security forces find Vale zip-tied to his desk, the evidence of his crimes 
            displayed on every screen in the building. Within hours, Nemesis Corp's dark secrets make global news.
            <br><br>Months later, you watch his sentencing from a safe distance. The system worked, for once.`,
            buttonText: 'Game Complete'
        },
        3: {
            title: 'New Management',
            content: `"Sign it," you command, sliding the ownership transfer across his desk. Vale's hand 
            shakes as he signs away his empire. You've become what you fought against, but with better toys.
            <br><br>Nemesis Corp has a new CEO. The cycle continues.`,
            buttonText: 'Game Complete'
        }
    },
    mechanics: {
        examineItem(game, itemId) {
            const item = game.stats.inventory.find(i => i.id === itemId);
            if (item) {
                game.showFeedback(item.name, item.description);
            }
        },
        chooseEnding(choice) {
            const game = window.gameApp;
            game.stats.ending = choice;
            game.currentStory = this.endings[choice];
            game.showStory = true;
            // Reset modal footer
            document.querySelector('.modal-footer').innerHTML = `
                <button class="btn cyber-btn" onclick="window.gameApp.closeFeedback()">
                    Continue
                </button>
            `;
        },
        onStart(game) {
            window.gameApp = window.gameApp || {};
            window.gameApp.examineItem = (itemId) => this.examineItem(game, itemId);
            game.currentRoom = this.rooms.valeConfrontation;
        }
    }
};
