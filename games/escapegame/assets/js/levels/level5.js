const level5 = {
    initialStory: {
        title: 'The Upgrade',
        content: `A back-alley ripperdoc installs the mantis blade modification. Your cyber-arm 
        splits and reforms, deadly blades extending from your forearm.<br><br>
        <div class="system-status">
            <span class="cyber-text">SYSTEM UPDATE:<br>
            - Mantis Blades installed<br>
            - Combat protocols activated<br>
            - Target: Marcus Vale</span>
        </div>`,
        buttonText: 'Begin Final Approach'
    },
    story: [
        {
            title: 'The Penthouse',
            content: `Vale's private penthouse occupies the top three floors of Nemesis Tower. 
            Security will be extreme, but you have something they don't expect - 
            their own military-grade cyber weapons.`,
            buttonText: 'Proceed'
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
            }
        ],
        securityBypass: false,
        powerDisabled: false,
        foundVale: false
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
        penthouseEntry: {
            background: 'assets/images/rooms/penthouse_entry.jpg',
            hotspots: [
                {
                    id: 'security_hub',
                    class: 'terminal clickable-image',
                    style: {
                        left: '15%',
                        top: '40%',
                        width: '15%',
                        height: '20%'
                    },
                    image: 'assets/images/items/security_hub.png',
                    action: (game) => {
                        if (!game.stats.securityBypass) {
                            game.showFeedback(
                                'Security Hub',
                                `<div class="cyber-text">ALERT: Mantis blade signature detected. 
                                Initiating lockdown...</div>`,
                                'Override'
                            );
                            game.stats.securityBypass = true;
                            // Check if both security and power are disabled
                            level5.mechanics.checkEntryComplete(game);
                        }
                    }
                },
                {
                    id: 'power_panel',
                    class: 'panel clickable-image',
                    style: {
                        left: '75%',
                        top: '30%',
                        width: '15%',
                        height: '30%'
                    },
                    image: 'assets/images/items/power_panel.png',
                    action: (game) => {
                        if (!game.stats.powerDisabled) {
                            game.stats.powerDisabled = true;
                            game.showFeedback(
                                'Power Systems',
                                'You slice through the power conduits with your mantis blade. Emergency power only.'
                            );
                            // Check if both security and power are disabled
                            level5.mechanics.checkEntryComplete(game);
                        }
                    }
                }
            ]
        },
        penthouseMain: {
            background: 'assets/images/rooms/penthouse_main.jpg',
            hotspots: [
                {
                    id: 'panic_room',
                    class: 'door clickable-image',
                    style: {
                        left: '40%',
                        top: '20%',
                        width: '20%',
                        height: '60%'
                    },
                    image: 'assets/images/items/panic_door.png',
                    locked: true,
                    action: (game) => {
                        if (this.locked) {
                            game.showFeedback('Locked', 'The panic room is powered by independent systems.');
                            return;
                        }
                        game.stats.foundVale = true;
                        game.loadLevel(6); // Changed to use loadLevel
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
        checkEntryComplete(game) {
            if (game.stats.securityBypass && game.stats.powerDisabled) {
                game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                    game.currentRoom = level5.rooms.penthouseMain;
                    game.updateUI();
                }, { once: true });
            }
        },
        onStart(game) {
            window.gameApp = window.gameApp || {};
            window.gameApp.examineItem = (itemId) => this.examineItem(game, itemId);
            game.currentRoom = level5.rooms.penthouseEntry; // Changed from this.rooms
        }
    }
};
