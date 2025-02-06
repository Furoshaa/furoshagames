const level3 = {
    initialStory: {
        title: 'Following the Trail',
        content: `Your new cybernetics hum with power. The leg's servo motors feel natural, 
        and the arm's neural interface is incredibly responsive. But more importantly, you found 
        something in the clinic's database - an access card belonging to Nemesis Corp.<br><br>
        <div class="system-status">
            <span class="cyber-text">NEW ABILITIES UNLOCKED:<br>
            - Enhanced Strength (Right Arm)<br>
            - Basic Network Interface (Neural Link)<br>
            - Enhanced Mobility (Left Leg)</span>
        </div>`,
        buttonText: 'Continue'
    },
    story: [
        {
            title: 'Nemesis Corp',
            content: `The building looms ahead - a steel and glass monument to corporate excess. 
            Security will be tight, but with your new cybernetics, you might have a chance.<br><br>
            The access card you found should get you in through the service entrance.`,
            buttonText: 'Enter Building'
        }
    ],
    stats: {
        inventory: [
            {
                id: 'keycard',
                name: 'Access Card',
                image: 'assets/images/items/keycard.png',
                description: 'Nemesis Corp service entrance access card.',
                type: 'key',
                canUse: true
            }
        ],
        hasSecurityCode: false,
        computerHacked: false
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
        serviceEntrance: {
            background: 'assets/images/rooms/service_entrance.jpg',
            hotspots: [
                {
                    id: 'door',
                    class: 'main-door clickable-area', // Changed from clickable-image to clickable-area
                    style: {
                        left: '45%',
                        top: '20%',
                        width: '20%',
                        height: '60%',
                        cursor: 'pointer' // Add cursor pointer to make it clear it's interactive
                    },
                    action: (game) => {
                        const hasCard = game.stats.inventory.find(i => i.id === 'keycard');
                        if (hasCard) {
                            game.currentRoom = level3.rooms.securityRoom;
                            game.showFeedback('Access Granted', 'The keycard works. You\'re in.');
                        } else {
                            game.showFeedback('Locked', 'You need an access card to enter.');
                        }
                    }
                }
            ]
        },
        securityRoom: {
            background: 'assets/images/rooms/security.jpg',
            hotspots: [
                {
                    id: 'computer',
                    class: 'terminal clickable-area',
                    style: {
                        left: '90%',
                        top: '35%',
                        width: '15%',
                        height: '20%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.computerHacked) {
                            // Initialize hacking minigame
                            game.initializeHacking({
                                grid: [
                                    ['7A', 'BD', 'E4', '1C'],
                                    ['55', '7A', 'BD', '2F'],
                                    ['E4', '1C', '55', '7A'],
                                    ['2F', 'E4', '1C', 'BD']
                                ],
                                target: ['7A', 'BD', '1C'],
                                onSuccess: () => {
                                    game.stats.computerHacked = true;
                                    game.stats.inventory.push({
                                        id: 'security_code',
                                        name: 'Security Code',
                                        image: 'assets/images/items/datafile.png',
                                        description: 'Code for the executive elevator: 3-1-4-7',
                                        type: 'data'
                                    });
                                    game.showFeedback('Access Granted', 'Security codes downloaded. The executive elevator code is: 3-1-4-7');
                                },
                                onFailure: () => {
                                    game.showFeedback('Access Denied', 'Incorrect sequence. Security protocols enhanced.');
                                }
                            });
                        }
                    }
                },
                {
                    id: 'elevator',
                    class: 'elevator-door clickable-area',
                    style: {
                        left: '18%',
                        top: '18%',
                        width: '15%',
                        height: '60%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        const hasCode = game.stats.inventory.find(i => i.id === 'security_code');
                        if (!hasCode) {
                            game.showFeedback('Locked', 'The executive elevator requires a security code.');
                            return;
                        }
                        
                        // Initialize keypad
                        game.initializeKeypad({
                            correctCode: '3147',
                            onSuccess: () => {
                                game.showFeedback('Access Granted', 'Elevator activated. Proceeding to executive level.');
                                setTimeout(() => game.loadLevel(4), 2000);
                            },
                            onFailure: () => {
                                game.showFeedback('Access Denied', 'Incorrect code. Security alert increased.');
                            },
                            maxAttempts: 3
                        });
                    }
                }
            ]
        }
    },
    mechanics: {
        examineItem(game, itemId) {
            const item = game.stats.inventory.find(i => i.id === itemId);
            if (item) {
                game.showFeedback(item.name, item.description);
            }
        },
        onStart(game) {
            window.gameApp = window.gameApp || {};
            window.gameApp.examineItem = (itemId) => this.examineItem(game, itemId);
            // Ensure stats and inventory are properly initialized
            game.stats = { ...level3.stats };
            // Set initial room using the level3 object directly
            game.currentRoom = level3.rooms.serviceEntrance;
        }
    }
};
