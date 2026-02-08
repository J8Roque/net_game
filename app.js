// NetFun - Main Application Script
class NetFunApp {
    constructor() {
        this.score = 0;
        this.gamesPlayed = 0;
        this.currentGame = null;
        this.ipGuesserGame = null;
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
        
        // Initialize all buttons
        this.initButtons();
        
        console.log('NetFun App initialized!');
    }

    initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.innerHTML = navMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }

        // Close menu when clicking a link (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
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
                    // Update active nav link
                    navLinks.forEach(link => link.classList.remove('active'));
                    const correspondingLink = document.querySelector(`a[href="${targetId}"]`);
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                    
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
        this.updateBinaryConverter();
    }

    updateBinaryConverter() {
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
        if (!decimalInput) return;
        
        let decimal = parseInt(decimalInput.value);
        if (isNaN(decimal)) decimal = 0;
        
        const bitValue = Math.pow(2, 7 - index);
        
        // Toggle the bit
        if (decimal & bitValue) {
            decimal -= bitValue; // Turn bit off
        } else {
            decimal += bitValue; // Turn bit on
        }
        
        // Ensure it stays within bounds
        if (decimal < 0) decimal = 0;
        if (decimal > 255) decimal = 255;
        
        decimalInput.value = decimal;
        this.updateBinaryConverter();
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

    initButtons() {
        // Initialize all button event listeners
        this.initAnalyzeButton();
        this.initSubnetButton();
        this.initGameButtons();
        this.initBackButtons();
    }

    initAnalyzeButton() {
        const analyzeButton = document.querySelector('button[onclick*="analyzeIP"]');
        if (analyzeButton) {
            analyzeButton.onclick = null;
            analyzeButton.addEventListener('click', () => this.analyzeIP());
        }
    }

    initSubnetButton() {
        const subnetButton = document.querySelector('button[onclick*="calculateSubnet"]');
        if (subnetButton) {
            subnetButton.onclick = null;
            subnetButton.addEventListener('click', () => this.calculateSubnet());
        }
    }

    initGameButtons() {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const gameName = card.querySelector('h3').textContent.toLowerCase();
                if (gameName.includes('detective')) this.loadGame('ip-guesser');
                else if (gameName.includes('neighborhood')) this.loadGame('neighborhood');
                else if (gameName.includes('binary')) this.loadGame('binary-builder');
                else if (gameName.includes('subnet')) this.loadGame('subnet-puzzle');
            });
        });
    }

    initBackButtons() {
        // This will be initialized when games are loaded
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
                <button class="btn btn-primary" id="learnMoreBtn">
                    <i class="fas fa-book"></i> Learn More
                </button>
            </div>
        `;
        
        // Add event listener to the new button
        document.getElementById('learnMoreBtn').addEventListener('click', () => {
            this.learnMoreAboutIP(ip);
        });
        
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

    calculateSubnet() {
        const subnetInput = document.getElementById('subnetInput');
        const subnetResult = document.getElementById('subnetResult');
        
        if (!subnetInput || !subnetResult) return;
        
        const input = subnetInput.value.trim();
        const parts = input.split('/');
        
        if (parts.length !== 2 || !this.validateIP(parts[0])) {
            subnetResult.innerHTML = `
                <
