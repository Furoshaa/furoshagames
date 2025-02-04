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
            buttonText: 'Continue'
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
                        left: '80%',
                        top: '40%',
                        width: '15%',
                        height: '30%',
                        cursor: 'pointer'
                    },
                    image: 'assets/images/items/door.png',
                    action: (game) => {
                        game.currentRoom = level2.rooms.storage;
                    }
                }
            ]
        },
        storage: {
            background: 'assets/images/rooms/storage.jpg',
            hotspots: [
                // Will generate random positions for boxes
                // Some boxes will contain the limbs
            ]
        }
    },
    mechanics: {
        generateBoxes() {
            const boxes = [];
            const positions = this.generateRandomPositions(8); // 8 boxes
            
            positions.forEach((pos, index) => {
                boxes.push({
                    id: `box_${index}`,
                    class: 'storage-box clickable-image',
                    style: {
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        width: '10%',
                        height: '10%',
                        cursor: 'pointer'
                    },
                    image: 'assets/images/items/box.png',
                    action: (game) => {
                        if (game.stats.searchedBoxes.includes(index)) {
                            game.showFeedback('Empty Box', 'You\'ve already searched this box.');
                            return;
                        }
                        
                        game.stats.searchedBoxes.push(index);
                        
                        if (index === 2) { // Arm in box 2
                            game.stats.foundArm = true;
                            game.showFeedback('Found!', 'A compatible cybernetic arm!');
                        } else if (index === 5) { // Leg in box 5
                            game.stats.foundLeg = true;
                            game.showFeedback('Found!', 'A compatible cybernetic leg!');
                        } else {
                            game.showFeedback('Empty Box', 'Nothing useful here...');
                        }
                        
                        if (game.stats.foundArm && game.stats.foundLeg) {
                            this.levelComplete(game);
                        }
                    }
                });
            });
            
            level2.rooms.storage.hotspots = boxes;
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
            game.currentStory = {
                title: 'Parts Acquired',
                content: `Perfect matches. These must have been meant for someone else, 
                but right now, they're exactly what you need. Time to get back to the 
                operating table and install them.`,
                buttonText: 'Continue to Level 3'
            };
            game.showStory = true;
        },
        onStart(game) {
            this.generateBoxes();
        }
    }
};
