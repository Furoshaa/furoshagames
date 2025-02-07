const level6 = {
    initialStory: {
        title: 'Final Confrontation',
        content: `Vale's panic room is a fortress of cutting-edge technology. Your neural interface 
        detects multiple cybernetic defense systems - he's completely integrated with the room's security.<br><br>
        <div class="system-status">
            <span class="cyber-text">ANALYSIS:<br>
            - Vale's cybernetic enhancement level: 94%<br>
            - Neural security protocols: Active<br>
            - Vulnerability detected: Neural Network Gateway</span>
        </div>`,
        buttonText: 'Proceed'
    },
    story: [
        {
            title: 'System Breach',
            content: `"You think you can stop me?" Vale's voice echoes through the room. 
            "I AM this building's security system!"<br><br>
            But that's exactly what makes him vulnerable. If you can breach his neural network, 
            you can shut down his entire system.`,
            buttonText: 'Begin Neural Hack'
        }
    ],
    stats: {
        inventory: [],
        systemsCompromised: 0,
        valeDefeated: false
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
        panicRoom: {
            background: 'assets/images/rooms/panic_room.jpg',
            hotspots: [
                {
                    id: 'neural_terminal',
                    class: 'terminal clickable-area',
                    style: {
                        left: '35%',
                        top: '5%',
                        width: '30%',
                        height: '55%',
                        cursor: 'pointer'
                    },
                    action: (game) => {
                        if (!game.stats.valeDefeated) {
                            level6.mechanics.initiateNeuralHack(game);
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
        chooseEnding(choiceNum) {
            const game = window.gameApp;
            const ending = level6.endings[choiceNum];
            
            // Close the choice modal first and remove backdrop
            const modalEl = document.getElementById('feedbackModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
                // Remove modal backdrop manually
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                // Remove modal-open class from body
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }

            // Short delay to ensure modal cleanup is complete
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
            game.currentRoom = level6.rooms.panicRoom;
        },
        neuralHackSequence: [
            {
                type: 'decrypt',
                name: 'Neural Firewall',
                description: 'Decrypt Vale\'s neural security pattern. Select the matching symbols to create a bridge.',
                config: {
                    grid: [
                        ['☢', '⚠', '☣', '⚠'],
                        ['⚡', '☠', '⚡', '☣'],
                        ['☣', '⚠', '☢', '⚡'],
                        ['⚠', '☣', '⚡', '☠']
                    ],
                    solution: ['⚡', '⚡', '⚡'] // Must connect matching symbols
                }
            },
            {
                type: 'sequence',
                name: 'Synaptic Override',
                description: 'Match the synaptic firing sequence to disrupt neural control. Remember the pattern.',
                config: {
                    pattern: ['RED', 'BLUE', 'RED', 'GREEN'],
                    displayTime: 1000, // ms per color
                    inputTime: 5000 // total time to input sequence
                }
            },
            {
                type: 'decrypt',
                name: 'Core Systems',
                description: 'Final layer - breach Vale\'s core neural network. Find the kill switch sequence.',
                config: {
                    grid: [
                        ['FF', '00', 'A7', 'E1'],
                        ['00', 'FF', 'E1', 'A7'],
                        ['A7', 'E1', 'FF', '00'],
                        ['FF', 'A7', '00', 'FF']
                    ],
                    solution: ['FF', 'FF', 'FF']
                }
            }
        ],

        initiateNeuralHack(game) {
            const currentHack = this.neuralHackSequence[game.stats.systemsCompromised];
            
            if (currentHack.type === 'decrypt') {
                game.initializeHacking({
                    grid: currentHack.config.grid,
                    target: currentHack.config.solution,
                    onSuccess: () => this.handleHackSuccess(game),
                    onFailure: () => this.handleHackFailure(game)
                });
            } else if (currentHack.type === 'sequence') {
                this.initiateSequenceChallenge(game, currentHack);
            }
        },

        initiateSequenceChallenge(game, challenge) {
            game.initializeSequenceChallenge({
                pattern: challenge.config.pattern,
                displayTime: challenge.config.displayTime,
                onSuccess: () => this.handleHackSuccess(game),
                onFailure: () => this.handleHackFailure(game)
            });
        },

        handleHackSuccess(game) {
            game.stats.systemsCompromised++;
            
            const messages = [
                'Neural firewall breached. Security protocols disrupted.',
                'Synaptic control compromised. Vale\'s neural link destabilizing.',
                'Core systems breached. Vale\'s cybernetic systems shutting down.'
            ];

            game.showFeedback('System Compromised', messages[game.stats.systemsCompromised - 1]);

            if (game.stats.systemsCompromised === 3) {
                this.completeGame(game);
            }
        },

        handleHackFailure(game) {
            game.showFeedback(
                'Neural Breach Failed',
                'Vale\'s security system countered your hack attempt. Try a different approach.',
                'Try Again'
            );
        },

        completeGame(game) {
            game.stats.valeDefeated = true;
            
            // Create a custom feedback without a close button
            const modalEl = document.getElementById('feedbackModal');
            const modalContent = modalEl.querySelector('.modal-content');
            
            // Save original footer content
            const originalFooter = modalEl.querySelector('.modal-footer').innerHTML;
            
            // Modify modal for the victory screen
            modalEl.querySelector('.modal-title').textContent = 'Victory';
            modalEl.querySelector('.modal-body').innerHTML = `
                <div class="cyber-text">
                    Vale's cybernetic systems crash one by one. His neural network collapses, 
                    leaving him helpless. The truth about your past - and his experiments - will 
                    finally come to light.
                </div>
                <div class="mt-4">
                    <h4 class="neon-text mb-3">How will you handle Vale?</h4>
                    <button onclick="level6.mechanics.chooseEnding(1)" class="btn cyber-btn mb-2 w-100">
                        Execute him (Swift Justice)
                    </button>
                    <button onclick="level6.mechanics.chooseEnding(2)" class="btn cyber-btn mb-2 w-100">
                        Turn him in to authorities (Justice Served)
                    </button>
                    <button onclick="level6.mechanics.chooseEnding(3)" class="btn cyber-btn mb-2 w-100">
                        Force him to sign over his company (New Management)
                    </button>
                </div>`;
            
            // Remove the footer completely for this modal
            modalEl.querySelector('.modal-footer').style.display = 'none';
            
            // Show the modified modal
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
            
            // Add event listener to restore original footer when modal is hidden
            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.querySelector('.modal-footer').style.display = '';
                modalEl.querySelector('.modal-footer').innerHTML = originalFooter;
            }, { once: true });
        }
    }
};
