// NetFun - Main Application Script
class NetFunApp {
    constructor() {
        this.score = 0;
        this.gamesPlayed = 0;
        this.currentGame = null;
        this.init();
    }

    init() {
        // Initialize components
        this.initNavigation();
        this.initHeroVisualizer();
        this.initBinaryConverter();
        this.initGameStats();
        this.loadWelcomeMessage();
        
        // Load saved progress
        this.loadProgress();
        
        // Add event listeners
        this.addEventListeners();
        
        console.log('NetFun App initialized!');
    }

    initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking a link (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initHeroVisualizer() {
        const visualizer = document.getElementById('heroVisualizer');
        if (!visualizer) return;

        const ips = [
            '192.168.1.1',
            '10.0.0.1',
            '172.16.0.1',
            '8.8.8.8'
        ];
        
        let currentIndex = 0;
        
        const updateVisualizer = () => {
            visualizer.innerHTML = this.createIPVisualization(ips[currentIndex]);
            currentIndex = (currentIndex + 1) % ips.length;
        };
        
        updateVisualizer();
        setInterval(updateVisualizer, 3000);
    }

    createIPVisualization(ip) {
        const parts = ip.split('.');
        return `
            <div class="ip-display">
                <div class="ip-parts">
                    ${parts.map(part => `
                        <div class="ip-part">
                            <div class="part-number">${part}</div>
                            <div class="part-binary">
                                ${this.decimalToBinary(parseInt(part)).split('').map(bit => `
                                    <span class="bit ${bit === '1' ? 'active' : ''}">${bit}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('<div class="dot">.</div>')}
                </div>
                <div class="ip-label">
                    <i class="fas fa-location-dot"></i> ${this.getIPType(ip)}
                </div>
            </div>
        `;
    }

    decimalToBinary(decimal) {
        return decimal.toString(2).padStart(8, '0');
    }

    getIPType(ip) {
        if (ip.startsWith('192.168.')) return 'Home Network';
        if (ip.startsWith('10.')) return 'Private Network';
        if (ip.startsWith('172.16.')) return 'Corporate Network';
        if (ip === '8.8.8.8') return 'Google DNS';
        return 'Public IP Address';
    }

    initBinaryConverter() {
        const decimalInput = document.getElementById('decimalInput');
        if (decimalInput) {
            decimalInput.addEventListener('input', this.convertDecimalToBinary);
            this.convertDecimalToBinary(); // Initial conversion
        }
    }

    convertDecimalToBinary() {
        const decimalInput = document.getElementById('decimalInput');
        const binaryBits = document.getElementById('binaryBits');
        
        if (!decimalInput || !binaryBits) return;
        
        let decimal = parseInt(decimalInput.value);
        if (isNaN(decimal) || decimal < 0) decimal = 0;
        if (decimal > 255) decimal = 255;
        decimalInput.value = decimal;
        
        const binary = this.decimalToBinary(decimal);
        
        binaryBits.innerHTML = binary.split('').map((bit, index) => `
            <div class="bit ${bit === '1' ? 'active' : ''}" 
                 onclick="app.flipBit(${index})"
                 title="Bit ${7-index} (Value: ${Math.pow(2, 7-index)})">
                ${bit}
            </div>
        `).join('');
    }

    flipBit(index) {
        const decimalInput = document.getElementById('decimalInput');
        let decimal = parseInt(decimalInput.value);
        const bitValue = Math.pow(2, 7 - index);
        
        // Toggle the bit
        if (decimal & bitValue) {
            decimal -= bitValue; // Turn bit off
        } else {
            decimal += bitValue; // Turn bit on
        }
        
        decimalInput.value = decimal;
        this.convertDecimalToBinary();
    }

    initGameStats() {
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const totalScore = document.getElementById('totalScore');
        const gamesPlayed = document.getElementById('gamesPlayed');
        
        if (totalScore) totalScore.textContent = this.score;
        if (gamesPlayed) gamesPlayed.textContent = this.gamesPlayed;
    }

    addEventListeners() {
        // Analyze IP button
        const analyzeButton = document.querySelector('[onclick="analyzeIP()"]');
        if (analyzeButton) {
            analyzeButton.onclick = null;
            analyzeButton.addEventListener('click', () => this.analyzeIP());
        }
    }

    analyzeIP() {
        const ipInput = document.getElementById('ipInput');
        const analysisDiv = document.getElementById('ipAnalysis');
        
        if (!ipInput || !analysisDiv) return;
        
        const ip = ipInput.value.trim();
        const isValid = this.validateIP(ip);
        
        if (!isValid) {
            analysisDiv.innerHTML = `
                <div class="analysis-error">
                    <i class="fas fa-times-circle"></i>
                    <h4>Invalid IP Address</h4>
                    <p>Please enter a valid IP address in the format: XXX.XXX.XXX.XXX</p>
                    <p>Each number must be between 0 and 255</p>
                </div>
            `;
            return;
        }
        
        const parts = ip.split('.');
        const analysis = this.analyzeIPAddress(ip);
        
        analysisDiv.innerHTML = `
            <div class="analysis-success">
                <i class="fas fa-check-circle"></i>
                <h4>Valid IP Address: ${ip}</h4>
                <div class="analysis-details">
                    <div class="detail">
                        <span class="label">Type:</span>
                        <span class="value ${analysis.typeClass}">${analysis.type}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Class:</span>
                        <span class="value">${analysis.class}</span>
                    </div>
                    <div class="detail">
                        <span class="label">First Octet:</span>
                        <span class="value">${parts[0]} (${this.decimalToBinary(parseInt(parts[0]))})</span>
                    </div>
                    <div class="detail">
                        <span class="label">Special Note:</span>
                        <span class="value">${analysis.special}</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="app.learnMoreAboutIP('${ip}')">
                    <i class="fas fa-book"></i> Learn More
                </button>
            </div>
        `;
        
        this.addScore(5);
    }

    validateIP(ip) {
        const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        const match = ip.match(pattern);
        
        if (!match) return false;
        
        for (let i = 1; i <= 4; i++) {
            const num = parseInt(match[i]);
            if (num < 0 || num > 255) return false;
        }
        
        return true;
    }

    analyzeIPAddress(ip) {
        const parts = ip.split('.').map(Number);
        const firstOctet = parts[0];
        
        let ipClass = '';
        let type = '';
        let typeClass = '';
        let special = 'Normal address';
        
        // Determine class
        if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
        else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
        else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
        else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
        else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Experimental)';
        
        // Determine type
        if (firstOctet === 10 || 
            (firstOctet === 172 && parts[1] >= 16 && parts[1] <= 31) ||
            (firstOctet === 192 && parts[1] === 168)) {
            type = 'Private IP';
            typeClass = 'private';
        } else if (firstOctet === 127) {
            type = 'Loopback IP';
            typeClass = 'loopback';
            special = 'Used for testing (localhost)';
        } else if (parts[3] === 0) {
            type = 'Network ID';
            typeClass = 'network';
            special = 'Identifies the network itself';
        } else if (parts[3] === 255) {
            type = 'Broadcast IP';
            typeClass = 'broadcast';
            special = 'Sends to all devices in network';
        } else if (firstOctet >= 224 && firstOctet <= 239) {
            type = 'Multicast IP';
            typeClass = 'multicast';
            special = 'Used for streaming to multiple devices';
        } else {
            type = 'Public IP';
            typeClass = 'public';
        }
        
        return { class: ipClass, type, typeClass, special };
    }

    loadGame(gameName) {
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        this.gamesPlayed++;
        this.updateStatsDisplay();
        
        switch (gameName) {
            case 'ip-guesser':
                gameContainer.innerHTML = this.loadIPGuesserGame();
                break;
            case 'neighborhood':
                gameContainer.innerHTML = this.loadNeighborhoodGame();
                break;
            case 'binary-builder':
                gameContainer.innerHTML = this.loadBinaryBuilderGame();
                break;
            case 'subnet-puzzle':
                gameContainer.innerHTML = this.loadSubnetPuzzleGame();
                break;
            default:
                this.loadWelcomeMessage();
        }
        
        // Scroll to game area
        document.getElementById('gameArea').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    loadIPGuesserGame() {
        return `
            <div class="game-ip-guesser">
                <h2><i class="fas fa-search"></i> IP Detective</h2>
                <p class="game-instruction">Find the valid IP addresses among the imposters!</p>
                
                <div class="game-info">
                    <div class="score-display">
                        <span>Score: <span id="gameScore">0</span></span>
                        <span>Time: <span id="gameTimer">60</span>s</span>
                    </div>
                    <div class="lives">
                        <i class="fas fa-heart"></i>
                        <i class="fas fa-heart"></i>
                        <i class="fas fa-heart"></i>
                    </div>
                </div>
                
                <div class="ip-options" id="ipOptions">
                    <!-- Options will be generated dynamically -->
                </div>
                
                <div class="game-controls">
                    <button class="btn btn-primary" onclick="app.startIPGuesser()">
                        <i class="fas fa-play"></i> Start Game
                    </button>
                    <button class="btn btn-secondary" onclick="app.loadWelcomeMessage()">
                        <i class="fas fa-home"></i> Back to Home
                    </button>
                </div>
                
                <div class="feedback" id="gameFeedback"></div>
            </div>
        `;
    }

    loadWelcomeMessage() {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.innerHTML = `
                <div class="welcome-message">
                    <h2>👋 Welcome to NetFun!</h2>
                    <p>Select a game from above to start playing and learning!</p>
                    <div class="game-stats">
                        <div class="stat">
                            <i class="fas fa-trophy"></i>
                            <span>Score: <span id="totalScore">${this.score}</span></span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>Games Played: <span id="gamesPlayed">${this.gamesPlayed}</span></span>
                        </div>
                    </div>
                    <div class="tip-box">
                        <i class="fas fa-lightbulb"></i>
                        <p><strong>Pro Tip:</strong> Start with "IP Detective" to learn what makes a valid IP address!</p>
                    </div>
                </div>
            `;
        }
    }

    addScore(points) {
        this.score += points;
        this.updateStatsDisplay();
        this.saveProgress();
        
        // Show score animation
        this.showNotification(`+${points} points!`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveProgress() {
        const progress = {
            score: this.score,
            gamesPlayed: this.gamesPlayed,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('netfun-progress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('netfun-progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.score = progress.score || 0;
                this.gamesPlayed = progress.gamesPlayed || 0;
            } catch (e) {
                console.log('Could not load saved progress');
            }
        }
    }

    learnMoreAboutIP(ip) {
        const analysisDiv = document.getElementById('ipAnalysis');
        if (!analysisDiv) return;
        
        const parts = ip.split('.').map(Number);
        const lesson = `
            <div class="lesson">
                <h4><i class="fas fa-graduation-cap"></i> Learning About ${ip}</h4>
                <div class="lesson-content">
                    <p><strong>What each part means:</strong></p>
                    <ul>
                        <li><code>${parts[0]}</code> - Network portion (identifies the network class)</li>
                        <li><code>${parts[1]}</code> - Further network subdivision</li>
                        <li><code>${parts[2]}</code> - Usually identifies a subnet</li>
                        <li><code>${parts[3]}</code> - Host identifier (specific device)</li>
                    </ul>
                    <p><strong>Think of it like a home address:</strong></p>
                    <div class="analogy">
                        <div class="address-part">
                            <span class="number">${parts[0]}</span>
                            <span class="label">City</span>
                        </div>
                        <div class="separator">.</div>
                        <div class="address-part">
                            <span class="number">${parts[1]}</span>
                            <span class="label">Street</span>
                        </div>
                        <div class="separator">.</div>
                        <div class="address-part">
                            <span class="number">${parts[2]}</span>
                            <span class="label">Block</span>
                        </div>
                        <div class="separator">.</div>
                        <div class="address-part">
                            <span class="number">${parts[3]}</span>
                            <span class="label">House #</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        analysisDiv.insertAdjacentHTML('beforeend', lesson);
        this.addScore(2);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NetFunApp();
});
