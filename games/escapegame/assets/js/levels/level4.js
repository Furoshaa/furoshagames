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
        inventory: [], // Remove initial inventory, will be inherited from previous level
        securityDisabled: false,
        foundSchematic: false,
        foundEvidence: false,
        hasComputerHint: false,
        hasSafeHint: false,
        hasAccessedEmails: false,
        computerUnlocked: false
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
                        left: '27%',
                        top: '28%',
                        width: '8%',
                        height: '27%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.securityDisabled) {
                            // Initialize hacking minigame with complex sequence
                            game.initializeHacking({
                                grid: [
                                    ['55', 'E9', '1C', 'A7'],
                                    ['FF', 'BD', '2F', 'E9'],
                                    ['1C', 'A7', '55', 'BD'],
                                    ['2F', 'E9', 'FF', '1C']
                                ],
                                target: ['FF', 'E9', '1C'],
                                onSuccess: () => {
                                    game.stats.securityDisabled = true;
                                    game.showFeedback('Security Disabled', 'Main security systems bypassed. CEO office accessible.');
                                    level4.rooms.executiveFloor.hotspots[1].locked = false;
                                },
                                onFailure: () => {
                                    game.showFeedback('Access Denied', 'Security alert level increased. Try a different sequence.');
                                }
                            });
                        }
                    }
                },
                {
                    id: 'ceo_office',
                    class: 'door clickable-area',
                    style: {
                        left: '63%',
                        top: '24%',
                        width: '8%',
                        height: '60%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.securityDisabled) {
                            game.showFeedback('Locked', 'The door is locked. The security system must be disabled first.');
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
                    id: 'drawer',
                    class: 'drawer clickable-area',
                    style: {
                        left: '49%',
                        top: '70%',
                        width: '10%',
                        height: '15%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.hasComputerHint) {
                            game.stats.hasComputerHint = true;
                            game.stats.inventory.push({
                                id: 'post_it',
                                name: 'Post-it Note',
                                image: 'assets/images/items/note.png',
                                description: 'A note reading: "V, stop using your daughter\'s birthday as your password! You are a CEO, not a basic IT beginner."',
                                type: 'data'
                            });
                            game.showFeedback('Found Item', 'You found a post-it note in the drawer.');
                        }
                    }
                },
                {
                    id: 'photo',
                    class: 'photo clickable-image',
                    style: {
                        left: '1%',
                        top: '53%',
                        width: '20%',
                        height: '13%',
                        cursor: 'pointer'
                    },
                    image: 'assets/images/items/vales_daughter.jpg',
                    action: (game) => {
                        if (game.stats.hasComputerHint) {
                            game.showFeedback('Family Photo', 'A photo of Vale with his daughter. The frame is engraved: "Sarah\'s 7th Birthday - 07/24/19"');
                        } else {
                            game.showFeedback('Family Photo', 'A family photo in an engraved frame.');
                        }
                    }
                },
                {
                    id: 'computer',
                    class: 'terminal clickable-area',
                    style: {
                        left: '15%',
                        top: '30%',
                        width: '23%',
                        height: '17%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.computerUnlocked) {
                            game.initializeKeypad({
                                correctCode: '0724', // Sarah's birthday without year
                                onSuccess: () => {
                                    game.stats.computerUnlocked = true;
                                    level4.mechanics.showComputerContents(game);
                                },
                                onFailure: () => {
                                    game.showFeedback('Access Denied', 'Incorrect password. Security notified.');
                                },
                                maxAttempts: 3
                            });
                        } else {
                            level4.mechanics.showComputerContents(game);
                        }
                    }
                },
                {
                    id: 'safe',
                    class: 'safe clickable-area',
                    style: {
                        left: '65%',
                        top: '35%',
                        width: '13%',
                        height: '22%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.foundSchematic) {
                            if (!game.stats.hasSafeHint) {
                                game.showFeedback('Safe', 'The safe requires a 4-digit code.');
                                return;
                            }
                            game.initializeKeypad({
                                correctCode: '7132', // Building number backwards
                                onSuccess: () => {
                                    game.stats.foundSchematic = true;
                                    game.stats.inventory.push({
                                        id: 'mantis_schematic',
                                        name: 'Mantis Blade Schematic',
                                        image: 'assets/images/items/schematic.png',
                                        description: 'Advanced weapon modification for cyber-arms.',
                                        type: 'upgrade'
                                    });
                                    game.showFeedback('Weapon Upgrade Found', 'You found schematics for an advanced cyber-arm weapon modification: Mantis Blades.');
                                    game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                                        level4.mechanics.checkCompletion(game);
                                    }, { once: true });
                                },
                                onFailure: () => {
                                    game.showFeedback('Access Denied', 'Incorrect safe code.');
                                },
                                maxAttempts: 3
                            });
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
        },
        showComputerContents(game) {
            const emailContent = `
                <div class="cyber-text">
                    <h5>EMAIL INBOX</h5>
                    -------------------------------------------------------------------------------------------<br>

                    [SECURITY] Safe Installation Report<br>
                    From: security@nemesiscorp.com<br>
                    To: m.vale@nemesiscorp.com<br>
                    ---------------<br><br>
                    Mr. Vale,<br><br>
                    The new safe has been installed in your office. As requested, we've 
                    implemented a unique coding system based on the corporation's founding principles.<br><br>
                    The first two digits represent our founding value: "71" - Advancement through Technology.<br><br>
                    For the remaining digits, please refer to Protocol 13, which states that all executive 
                    codes must incorporate their respective floor numbers in reverse order. As your office 
                    is on the 23rd floor, this completes your unique safe combination.<br><br>
                    Please memorize this information and delete this email.<br><br>
                    Security Team<br><br>

                    --------------------------------------------------------------<br>

                    [HR] Annual Security Audit<br>
                    From: hr@nemesiscorp.com<br>
                    To: all-staff@nemesiscorp.com<br>
                    ---------------<br>
                    REMINDER: The annual security audit is next week. Please ensure all sensitive 
                    documents are properly secured in designated safes. Remember to follow Protocol 32 
                    for all security measures.<br><br>
                </div>`;

            if (!game.stats.foundEvidence) {
                game.stats.foundEvidence = true;
                game.stats.hasSafeHint = true;
                game.stats.inventory.push({
                    id: 'evidence',
                    name: 'Termination Order',
                    image: 'assets/images/items/document.png',
                    description: 'Signed order for your termination by CEO Marcus Vale.',
                    type: 'data'
                });
            }

            game.showEmailTerminal(emailContent);
        }
    }
};
