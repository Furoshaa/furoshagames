const level1 = {
    initialStory: {
        title: 'System Reboot',
        content: `Pain. That's the first thing you register as your consciousness floods back. 
        Your right arm and left leg are gone - clean cuts, professional work. But they're 
        bleeding badly.<br><br>
        <div class="system-status">
            SYSTEM STATUS:<br>
            <span class="blink danger-text">BLOOD LEVEL: 67% [CRITICAL]</span><br>
            RIGHT ARM: MISSING<br>
            LEFT LEG: MISSING<br>
            SEEK IMMEDIATE MEDICAL ATTENTION
        </div>`,
        buttonText: 'Try to Move...'
    },
    story: [
        {
            title: 'Critical Status',
            content: `Your neural interface flashes urgent warnings: <br>
            <span class="danger-text">CRITICAL BLOOD LOSS DETECTED<br>
            MAJOR SYSTEMS COMPROMISED<br>
            IMMEDIATE MEDICAL ATTENTION REQUIRED</span><br><br>
            You need to find a way to stop the bleeding before you can even think about 
            replacement limbs.`,
            buttonText: 'Look Around'
        },
        {
            title: 'The Clinic',
            content: `The room swims into focus. An operating table dominates the center, 
            its surface gleaming with fresh blood - your blood. Medical tools and cyber-
            surgical equipment line the walls. Someone left in a hurry...<br><br>
            You need to get to that operating table. It's your only chance to install 
            the emergency connection ports and stop the bleeding.`,
            buttonText: 'Enter Room'
        }
    ],
    stats: {
        bloodLoss: 67,
        hasArmLink: false,
        hasLegLink: false
    },
    ui: {
        rightPanel: {
            render(game) {
                return `
                    <div class="cyber-panel p-3">
                        <h4 class="neon-text mb-3">System Status</h4>
                        <div class="status-grid">
                            <div class="status-item danger-text rapid-blink">
                                Blood Level: ${game.stats.bloodLoss}% [CRITICAL]
                            </div>
                            <div class="status-item damaged">
                                Right Arm: MISSING
                            </div>
                            <div class="status-item damaged">
                                Left Leg: MISSING
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    },
    mechanics: {
        bloodLossTimer: null,
        
        onRoomEnter(game) {
            this.startBloodLossTimer(game);
        },
        
        onReset(game) {
            this.stopTimer(game);
        },

        startBloodLossTimer(game) {
            if (this.bloodLossTimer) {
                clearInterval(this.bloodLossTimer);
            }
            
            this.bloodLossTimer = setInterval(() => {
                if (!game.stats.hasArmLink && !game.isGameOver) {
                    game.stats.bloodLoss = Math.max(0, game.stats.bloodLoss - 1);
                    
                    if (game.stats.bloodLoss <= 20) {
                        this.stopTimer(game);
                        game.gameOver('Critical System Failure', 'Blood level critically low. Emergency shutdown initiated.');
                    }
                }
            }, 1000);
        },

        stopTimer(game) {
            if (this.bloodLossTimer) {
                clearInterval(this.bloodLossTimer);
                this.bloodLossTimer = null;
            }
        }
    },
    rooms: {
        clinic: {
            background: 'assets/images/rooms/clinic.jpg',
            hotspots: [
                {
                    id: 'table',
                    class: 'operating-table clickable-image',
                    style: {
                        left: '40%',
                        top: '50%',
                        width: '20%',
                        height: 'auto',
                        cursor: 'pointer'
                    },
                    image: 'assets/images/items/chair.png',
                    action: (game) => {
                        if (!game.stats.hasArmLink) {
                            game.showFeedback(
                                'Operating Table',
                                'The auto-surgeon is ready. Install emergency connection ports to stop the bleeding?',
                                'Begin Procedure'
                            );
                        }
                    }
                }
            ]
        }
    }
};
