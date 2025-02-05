const level4 = {
    initialStory: {
        title: 'Executive Access',
        content: `The executive elevator hums as it carries you upward. Your cybernetics 
        are working perfectly, but you'll need more than brute force here.<br><br>
        <div class="system-status">
            <span class="cyber-text">OBJECTIVES:<br>
            - Access executive offices<br>
            - Find evidence of who ordered your "termination"<br>
            - Locate weapon upgrade schematics</span>
        </div>`,
        buttonText: 'Begin Infiltration'
    },
    story: [
        {
            title: 'Executive Floor',
            content: `The elevator opens to reveal polished marble and glass. Security 
            cameras sweep the hallways, but your neural interface detects a vulnerability 
            in their network.`,
            buttonText: 'Continue'
        }
    ],
    stats: {
        inventory: [
            // Carry over items from level 3
            {
                id: 'cyberarm',
                name: 'Military Grade Cyber-Arm',
                image: 'assets/images/items/cyberarm.png',
                description: 'Enhanced strength and precision. Can force open weak doors.',
                type: 'equipped',
                abilities: ['strength']
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
        securityDisabled: false,
        foundSchematic: false,
        foundEvidence: false
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
        executiveFloor: {
            background: 'assets/images/rooms/executive_floor.jpg',
            hotspots: [
                {
                    id: 'security_panel',
                    class: 'terminal clickable-area',
                    style: {
                        left: '10%',
                        top: '40%',
                        width: '15%',
                        height: '20%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.securityDisabled) {
                            game.showFeedback(
                                'Security System',
                                `<div class="cyber-text">SECURITY OVERRIDE<br>
                                -------------<br>
                                Initiating neural interface hack...</div>`,
                                'Execute'
                            );
                            game.stats.securityDisabled = true;
                            // Enable access to CEO office immediately after feedback closes
                            game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                                level4.rooms.executiveFloor.hotspots[1].locked = false;
                                game.updateUI();
                            }, { once: true });
                        }
                    }
                },
                {
                    id: 'ceo_office',
                    class: 'door clickable-area',
                    style: {
                        left: '60%',
                        top: '30%',
                        width: '20%',
                        height: '50%',
                        cursor: 'pointer'
                    },
                    locked: true,
                    action: (game) => {
                        if (this.locked) {
                            game.showFeedback('Locked', 'The security system must be disabled first.');
                            return;
                        }
                        game.currentRoom = level4.rooms.ceoOffice;
                    }
                }
            ]
        },
        ceoOffice: {
            background: 'assets/images/rooms/ceo_office.jpg',
            hotspots: [
                {
                    id: 'computer',
                    class: 'terminal clickable-area',
                    style: {
                        left: '40%',
                        top: '40%',
                        width: '20%',
                        height: '20%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.foundEvidence) {
                            game.stats.foundEvidence = true;
                            game.stats.inventory.push({
                                id: 'evidence',
                                name: 'Termination Order',
                                image: 'assets/images/items/document.png',
                                description: 'Signed order for your termination by CEO Marcus Vale.',
                                type: 'data'
                            });
                            game.showFeedback(
                                'Found Evidence',
                                'You find the termination order. It was signed by CEO Marcus Vale himself.'
                            );
                            game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                                level4.mechanics.checkCompletion(game);
                            }, { once: true });
                        }
                    }
                },
                {
                    id: 'safe',
                    class: 'safe clickable-area',
                    style: {
                        left: '70%',
                        top: '50%',
                        width: '15%',
                        height: '30%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.foundSchematic) {
                            game.stats.foundSchematic = true;
                            game.stats.inventory.push({
                                id: 'mantis_schematic',
                                name: 'Mantis Blade Schematic',
                                image: 'assets/images/items/schematic.png',
                                description: 'Advanced weapon modification for cyber-arms.',
                                type: 'upgrade'
                            });
                            game.showFeedback(
                                'Weapon Upgrade Found',
                                'You found schematics for an advanced cyber-arm weapon modification: Mantis Blades.'
                            );
                            game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                                level4.mechanics.checkCompletion(game);
                            }, { once: true });
                        }
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
        checkCompletion(game) {
            if (game.stats.foundEvidence && game.stats.foundSchematic) {
                setTimeout(() => {
                    game.loadLevel(5);
                }, 500);
            }
        },
        onStart(game) {
            window.gameApp = window.gameApp || {};
            window.gameApp.examineItem = (itemId) => this.examineItem(game, itemId);
            game.currentRoom = level4.rooms.executiveFloor;
        }
    }
};
