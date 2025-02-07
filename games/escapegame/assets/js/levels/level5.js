const level5 = {
    initialStory: {
        title: 'The Server Sanctum',
        content: `With the mantis blade schematics installed, you've reached Vale's private server room. 
        This is where he keeps his most sensitive data - and the access codes to his panic room.<br><br>
        <div class="system-status">
            <span class="cyber-text">OBJECTIVES:<br>
            - Breach the quantum encryption server<br>
            - Override security lockdown<br>
            - Download panic room access codes</span>
        </div>`,
        buttonText: 'Begin Infiltration'
    },
    story: [  // Add this story array
        {
            title: 'Neural Connection',
            content: `The server room hums with the combined processing power of thousands of quantum cores. 
            Your neural interface detects multiple security layers - this won't be easy.<br><br>
            You'll need to breach three security nodes before you can access the mainframe. One wrong move 
            and the whole system goes into lockdown.`,
            buttonText: 'Start Breach'
        }
    ],
    stats: {
        inventory: [],
        serversBypassed: 0,
        mainframeHacked: false,
        codesDownloaded: false,
        currentChallenge: 0 // Track which challenge we're on
    },
    ui: {
        rightPanel: {
            render(game) {
                return `
                    <div class="cyber-panel p-3">
                        <h4 class="neon-text mb-3">System Status</h4>
                        <div class="inventory-grid">
                            ${game.stats.inventory.map(item => `
                                <div class="inventory-item ${item.type}" onclick="window.gameApp.examineItem('${item.id}')">
                                    <img src="${item.image}" alt="${item.name}" class="item-image">
                                    <div class="item-name">${item.name}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-4">
                            <div class="status-grid">
                                <div class="status-item ${game.stats.mainframeHacked ? 'found' : ''}">
                                    Mainframe: ${game.stats.mainframeHacked ? 'ACCESSED' : 'LOCKED'}
                                </div>
                                <div class="status-item ${game.stats.serversBypassed === 3 ? 'found' : ''}">
                                    Security Nodes: ${game.stats.serversBypassed}/3
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    },
    rooms: {
        serverRoom: {
            background: 'assets/images/rooms/server_room.jpg',
            hotspots: [
                {
                    id: 'security_terminal',
                    class: 'terminal clickable-area',
                    style: {
                        left: '40%',
                        top: '48%',
                        width: '17%',
                        height: '17%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (game.stats.serversBypassed < 3) {
                            level5.mechanics.initiateChallenge(game);
                        }
                    }
                },
                {
                    id: 'mainframe',
                    class: 'mainframe clickable-area',
                    style: {
                        left: '40%',
                        top: '25%',
                        width: '17%',
                        height: '18%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (game.stats.serversBypassed === 3 && !game.stats.codesDownloaded) {
                            game.stats.codesDownloaded = true;
                            game.stats.inventory.push({
                                id: 'panic_codes',
                                name: 'Panic Room Codes',
                                image: 'assets/images/items/codes.png',
                                description: 'Access codes to Vale\'s panic room.',
                                type: 'data'
                            });
                            game.showFeedback(
                                'Download Complete',
                                'Panic room access codes successfully retrieved. Time to pay Vale a visit.'
                            );
                            game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                                game.loadLevel(6);
                            }, { once: true });
                        } else if (game.stats.serversBypassed < 3) {
                            game.showFeedback('Access Denied', 'All security nodes must be disabled first.');
                        }
                    }
                }
            ]
        }
    },
    mechanics: {
        challenges: [
            {
                name: 'Primary Firewall',
                description: 'Breach the primary security layer using the breach protocol.',
                type: 'hack',
                config: {
                    grid: [
                        ['55', 'E9', '1C', 'A7'],
                        ['FF', 'BD', '2F', 'E9'],
                        ['1C', 'A7', '55', 'BD'],
                        ['2F', 'E9', 'FF', '1C']
                    ],
                    target: ['55', 'BD', '1C']
                }
            },
            {
                name: 'Logic Gate',
                description: `MATHEMATICAL SEQUENCE LOCK DETECTED<br><br>
                    Calculate next number in sequence:<br>
                    256, 512, 1024, 2048, ?<br><br>
                    Enter the next number in sequence`,
                type: 'keypad',
                code: '4096' 
            },
            {
                name: 'Binary Lock',
                description: `BINARY CONVERSION LOCK DETECTED<br><br>
                    Convert to decimal:<br>
                    10101100<br><br>
                    Enter 4-digit answer (pad with zeros)`,
                type: 'keypad',
                code: '0172'
            }
        ],

        initiateChallenge(game) {
            const challenge = this.challenges[game.stats.currentChallenge];
            
            const startKeypadChallenge = () => {
                game.initializeKeypad({
                    correctCode: challenge.code,
                    onSuccess: () => this.handleChallengeSuccess(game),
                    onFailure: () => game.gameOver('Security Alert', 'Incorrect input triggered security lockdown.')
                });
            };

            if (challenge.type === 'hack') {
                game.initializeHacking({
                    grid: challenge.config.grid,
                    target: challenge.config.target,
                    onSuccess: () => this.handleChallengeSuccess(game),
                    onFailure: () => game.gameOver('Security Alert', 'Incorrect sequence triggered security lockdown.')
                });
            } else {
                // Show description first, then keypad
                game.showFeedback(
                    challenge.name,
                    challenge.description,
                    'Proceed'
                );
                
                // Wait for feedback to close before showing keypad
                game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                    startKeypadChallenge();
                }, { once: true });
            }
        },

        handleChallengeSuccess(game) {
            game.stats.serversBypassed++;
            game.stats.currentChallenge++;
            
            const messages = [
                'Primary security layer disabled.',
                'Secondary security layer breached.',
                'Final security layer destroyed. Mainframe access granted.'
            ];

            game.showFeedback('Access Node Breached', messages[game.stats.serversBypassed - 1]);

            if (game.stats.serversBypassed === 3) {
                game.showFeedback('All Systems Breached', 'Mainframe access now available. Download the panic room codes.');
            }
        },

        checkServerProgress(game) {
            const progress = game.stats.serversBypassed;
            if (progress === 3) {
                game.showFeedback('All Systems Breached', 'Mainframe access now available. Download the panic room codes.');
            }
        }
    }
};
