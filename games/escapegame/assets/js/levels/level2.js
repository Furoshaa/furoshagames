const level2 = {
    initialStory: {
        title: 'The Search Begins',
        content: `The emergency ports throb with a dull ache. You're stable, but practically helpless 
        without limbs. The clinic's storage area might have compatible cybernetics - if you can get there.<br><br>
        <div class="system-status">
            <span class="cyber-text">CURRENT OBJECTIVES:<br>
            - Locate compatible cybernetic arm<br>
            - Locate compatible cybernetic leg<br>
            - Install replacements</span>
        </div>`,
        buttonText: 'Begin Search'
    },
    story: [
        {
            title: 'Limited Mobility',
            content: `Moving is a challenge. With one arm, you can drag yourself across the floor, 
            but it's slow and degrading. The storage area is through a door on the far side of the clinic.`,
            buttonText: 'Begin Search'
        }
    ],
    stats: {
        foundArm: false,
        foundLeg: false,
        searchedBoxes: []
    },
    ui: {
        rightPanel: {
            render(game) {
                return `
                    <div class="cyber-panel p-3">
                        <h4 class="neon-text mb-3">Equipment Status</h4>
                        <div class="status-grid">
                            <div class="status-item ${game.stats.foundArm ? 'found' : 'damaged'}">
                                Right Arm: ${game.stats.foundArm ? 'FOUND' : 'SEARCHING'}
                            </div>
                            <div class="status-item ${game.stats.foundLeg ? 'found' : 'damaged'}">
                                Left Leg: ${game.stats.foundLeg ? 'FOUND' : 'SEARCHING'}
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    },
    rooms: {
        clinic: {
            background: 'assets/images/rooms/clinic.jpg',
            hotspots: [
                {
                    id: 'door',
                    class: 'storage-door clickable-image',
                    style: {
                        left: '30%',
                        top: '30%',
                        width: '20%',
                        height: '40%',
                        cursor: 'pointer'
                    },
                    image: 'assets/images/items/door_real.jpg',
                    action: (game) => {
                        game.showFeedback(
                            'Storage Room',
                            `You've made it to the storage room. The shelves are lined with boxes containing 
                            various cybernetic parts. Most look damaged or incompatible, but among them might be exactly 
                            what you need.<br><br>
                            <span class="cyber-text">Search through the boxes carefully. You're looking for specific 
                            compatibility markers that match your emergency ports.</span>`,
                            'Enter Room'
                        );
                        game.feedbackModal._element.addEventListener('hidden.bs.modal', () => {
                            game.currentRoom = level2.rooms.storage;
                            game.updateUI();
                        }, { once: true });
                    }
                }
            ]
        },
        storage: {
            background: 'assets/images/rooms/storage.jpg',
            hotspots: []  // Will be populated by generateBoxes()
        }
    },
    mechanics: {
        generateBoxes() {
            const boxes = [];
            const rows = 3;
            const cols = 4;
            const boxWidth = 20;  // Increased size
            const boxHeight = 20;
            const padding = 5;
            
            // Generate positions in a grid to avoid overlap
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = 10 + (col * (boxWidth + padding));
                    const y = 10 + (row * (boxHeight + padding));
                    
                    const index = row * cols + col;
                    boxes.push({
                        id: `box_${index}`,
                        class: 'storage-box clickable-image',
                        style: {
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${boxWidth}%`,
                            height: `${boxHeight}%`,
                            cursor: 'pointer'
                        },
                        image: 'assets/images/items/box.png',
                        action: (game) => {
                            if (game.stats.searchedBoxes.includes(index)) {
                                game.showFeedback('Empty Box', 'You\'ve already searched this box.');
                                return;
                            }
                            
                            game.stats.searchedBoxes.push(index);
                            
                            if (index === 6) {  // Changed winning position
                                game.stats.foundArm = true;
                                game.showFeedback('Found!', 'A compatible cybernetic arm! The neural interface patterns match your emergency port perfectly.');
                                this.checkCompletion(game);  // Add this line
                            } else if (index === 11) {  // Changed winning position to last box
                                game.stats.foundLeg = true;
                                game.showFeedback('Found!', 'A compatible cybernetic leg! The connection specifications are an exact match.');
                                this.checkCompletion(game);  // Add this line
                            } else {
                                game.showFeedback('Empty Box', 'This box contains incompatible parts. Keep searching.');
                            }
                        }
                    });
                }
            }
            
            level2.rooms.storage.hotspots = boxes;
        },
        checkCompletion(game) {
            if (game.stats.foundArm && game.stats.foundLeg) {
                // Add a small delay to ensure the feedback modal is closed
                setTimeout(() => {
                    game.loadLevel(3);
                }, 100);
            }
        },
        generateRandomPositions(count) {
            const positions = [];
            for (let i = 0; i < count; i++) {
                positions.push({
                    x: 20 + Math.random() * 60, // Between 20% and 80%
                    y: 20 + Math.random() * 60  // Between 20% and 80%
                });
            }
            return positions;
        },
        levelComplete(game) {
            game.loadLevel(3); // Changed from setting currentStory to directly loading level 3
        },
        onStart(game) {
            this.generateBoxes();
        }
    }
};
