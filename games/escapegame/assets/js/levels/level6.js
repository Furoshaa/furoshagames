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
        inventory: [], // Remove initial inventory, will be inherited from previous level
        ending: null
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
                    class: 'character clickable-area',
                    style: {
                        left: '40%',
                        top: '30%',
                        width: '20%',
                        height: '50%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        // Initialize combat with Vale
                        game.initializeCombat({
                            onVictory: () => {
                                game.showFeedback(
                                    'Victory',
                                    `Vale lies defeated. Now you must decide his fate.<br><br>
                                    <button class="btn cyber-btn me-2" onclick="level6.mechanics.chooseEnding(1)">Execute</button>
                                    <button class="btn cyber-btn me-2" onclick="level6.mechanics.chooseEnding(2)">Arrest</button>
                                    <button class="btn cyber-btn" onclick="level6.mechanics.chooseEnding(3)">Control</button>`
                                );
                            },
                            onDefeat: () => {
                                game.gameOver('Defeat', 'Vale\'s security systems overwhelmed you. Game Over.');
                            },
                            specialMoves: {
                                quick: {
                                    name: 'Quick Strike',
                                    damage: [5, 15],
                                    counterChance: 0.3
                                },
                                heavy: {
                                    name: 'Heavy Attack',
                                    damage: [15, 25],
                                    counterChance: 0.6
                                },
                                parry: {
                                    name: 'Parry',
                                    damage: [0, 10],
                                    counterChance: 0.1
                                }
                            }
                        });
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
        chooseEnding(choiceNum) {
            const game = window.gameApp;
            const ending = level6.endings[choiceNum];
            
            // Close the choice modal first
            const modalEl = document.getElementById('feedbackModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            // Short delay to ensure modal is closed
            setTimeout(() => {
                // Update the story directly
                game.showStory = true;
                game.currentStory = {
                    title: ending.title,
                    content: `${ending.content}<br><br>
                        <div class="cyber-text mt-4">
                            MISSION STATUS: COMPLETE<br>
                            ------------------------------<br>
                            Ending Achieved: ${ending.title}<br>
                            ------------------------------<br>
                            Thank you for playing Cyberpunk Awakening
                        </div>`,
                    buttonText: 'Return to Main Menu'
                };

                // Set up return to menu button
                Vue.nextTick(() => {
                    const storyButton = document.querySelector('.story-panel .cyber-btn');
                    if (storyButton) {
                        storyButton.onclick = () => window.location.href = '../../index.php';
                    }
                });
            }, 300);
        },
        onStart(game) {
            window.gameApp = game;  // Store the entire game instance
            window.gameApp.examineItem = (itemId) => this.examineItem(game, itemId);
            game.currentRoom = level6.rooms.valeConfrontation;
        }
    }
};
