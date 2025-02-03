const level1 = {
    initialStory: {
        title: 'System Reboot',
        content: `Pain. That's the first thing you register as your consciousness floods back. 
        Your right arm and left leg are gone - clean cuts, professional work. But they're 
        bleeding badly.<br><br>Through the haze of pain, you recognize your surroundings: 
        an illegal cyberclinic. The kind that doesn't ask questions... or keep records.`,
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
    rooms: {
        clinic: {
            background: 'assets/images/rooms/clinic.png',
            hotspots: [
                {
                    id: 'table',
                    class: 'operating-table',
                    style: {
                        left: '40%',
                        top: '50%',
                        width: '20%',
                        height: '30%'
                    },
                    action: (game) => {
                        if (!game.stats.hasArmLink) {
                            game.showFeedback(
                                'Operating Table',
                                'The auto-surgeon is ready. Install emergency connection ports to stop the bleeding?',
                                'Begin Procedure'
                            );
                            // Add procedure logic here
                        }
                    }
                }
                // Add more hotspots as needed
            ]
        }
    }
};
