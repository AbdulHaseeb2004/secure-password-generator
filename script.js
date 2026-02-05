document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordText = document.getElementById('password-text');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copy-message');
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const strengthText = document.getElementById('strength-text');
    const saveBtn = document.getElementById('save-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyList = document.getElementById('history-list');
    const passwordHistory = document.getElementById('password-history');
    
    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Password history
    let passwordHistoryData = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    
    // Initialize
    updateStrengthMeter();
    updatePasswordHistory();
    passwordHistory.style.display = 'none';
    
    // Event Listeners
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
        updateStrengthMeter();
    });
    
    [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
        checkbox.addEventListener('change', updateStrengthMeter);
    });
    
    generateBtn.addEventListener('click', generatePassword);
    
    copyBtn.addEventListener('click', copyPassword);
    
    saveBtn.addEventListener('click', savePassword);
    
    historyBtn.addEventListener('click', toggleHistory);
    
    // Functions
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const includeUppercase = uppercaseCheck.checked;
        const includeLowercase = lowercaseCheck.checked;
        const includeNumbers = numbersCheck.checked;
        const includeSymbols = symbolsCheck.checked;
        
        // Validate at least one character set is selected
        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
            alert('Please select at least one character type!');
            return;
        }
        
        // Build character pool
        let charPool = '';
        if (includeUppercase) charPool += uppercaseChars;
        if (includeLowercase) charPool += lowercaseChars;
        if (includeNumbers) charPool += numberChars;
        if (includeSymbols) charPool += symbolChars;
        
        // Generate password
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password += charPool[randomIndex];
        }
        
        // Ensure at least one character from each selected set is included
        password = enforceCharacterSets(password, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
        
        // Display password
        passwordText.textContent = password;
        
        // Update strength meter
        updateStrengthMeter();
    }
    
    function enforceCharacterSets(password, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
        let newPassword = password.split('');
        
        // Helper function to ensure at least one character from a set
        const ensureCharFromSet = (charSet, testRegex) => {
            if (!testRegex.test(password)) {
                const randomIndex = Math.floor(Math.random() * newPassword.length);
                const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
                newPassword[randomIndex] = randomChar;
            }
        };
        
        if (includeUppercase) ensureCharFromSet(uppercaseChars, /[A-Z]/);
        if (includeLowercase) ensureCharFromSet(lowercaseChars, /[a-z]/);
        if (includeNumbers) ensureCharFromSet(numberChars, /[0-9]/);
        if (includeSymbols) ensureCharFromSet(symbolChars, /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
        
        return newPassword.join('');
    }
    
    function updateStrengthMeter() {
        const length = parseInt(lengthSlider.value);
        const includeUppercase = uppercaseCheck.checked;
        const includeLowercase = lowercaseCheck.checked;
        const includeNumbers = numbersCheck.checked;
        const includeSymbols = symbolsCheck.checked;
        
        // Calculate score (0-100)
        let score = 0;
        
        // Length contributes up to 40 points
        score += Math.min(length * 1.5, 40);
        
        // Character variety contributes up to 60 points
        let varietyCount = 0;
        if (includeUppercase) varietyCount++;
        if (includeLowercase) varietyCount++;
        if (includeNumbers) varietyCount++;
        if (includeSymbols) varietyCount++;
        score += varietyCount * 15;
        
        // Update strength bars and text
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => bar.style.background = 'rgba(255, 255, 255, 0.1)');
        
        let strengthLevel, strengthColor;
        
        if (score < 30) {
            strengthLevel = 'Very Weak';
            strengthColor = '#ff4757';
            bars[0].style.background = strengthColor;
        } else if (score < 50) {
            strengthLevel = 'Weak';
            strengthColor = '#ff6b6b';
            bars[0].style.background = strengthColor;
            bars[1].style.background = strengthColor;
        } else if (score < 70) {
            strengthLevel = 'Medium';
            strengthColor = '#ffa502';
            bars[0].style.background = strengthColor;
            bars[1].style.background = strengthColor;
            bars[2].style.background = strengthColor;
        } else if (score < 85) {
            strengthLevel = 'Strong';
            strengthColor = '#2ed573';
            bars[0].style.background = strengthColor;
            bars[1].style.background = strengthColor;
            bars[2].style.background = strengthColor;
            bars[3].style.background = strengthColor;
        } else {
            strengthLevel = 'Very Strong';
            strengthColor = '#00d2d3';
            bars.forEach(bar => bar.style.background = strengthColor);
        }
        
        strengthText.textContent = strengthLevel;
        strengthText.style.color = strengthColor;
    }
    
    function copyPassword() {
        const password = passwordText.textContent;
        
        if (password === 'Click Generate Password') {
            alert('Please generate a password first!');
            return;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(password).then(() => {
            // Show copy confirmation
            copyMessage.style.opacity = '1';
            setTimeout(() => {
                copyMessage.style.opacity = '0';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy password to clipboard');
        });
    }
    
    function savePassword() {
        const password = passwordText.textContent;
        
        if (password === 'Click Generate Password') {
            alert('Please generate a password first!');
            return;
        }
        
        // Add to history
        const passwordItem = {
            password: password,
            timestamp: new Date().toLocaleString()
        };
        
        passwordHistoryData.unshift(passwordItem);
        
        // Keep only last 10 passwords
        if (passwordHistoryData.length > 10) {
            passwordHistoryData = passwordHistoryData.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('passwordHistory', JSON.stringify(passwordHistoryData));
        
        // Update history display
        updatePasswordHistory();
        
        // Show history section
        passwordHistory.style.display = 'block';
        
        // Show confirmation
        alert('Password saved to history!');
    }
    
    function toggleHistory() {
        if (passwordHistory.style.display === 'none') {
            passwordHistory.style.display = 'block';
            historyBtn.innerHTML = '<i class="fas fa-times"></i> Hide History';
        } else {
            passwordHistory.style.display = 'none';
            historyBtn.innerHTML = '<i class="fas fa-history"></i> View History';
        }
    }
    
    function updatePasswordHistory() {
        if (passwordHistoryData.length === 0) {
            historyList.innerHTML = '<div class="history-item"><span>No passwords saved yet</span></div>';
            return;
        }
        
        historyList.innerHTML = '';
        
        passwordHistoryData.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <span class="history-password">${maskPassword(item.password)}</span>
                <span class="history-time">${item.timestamp}</span>
                <button class="copy-history-btn" data-index="${index}" title="Copy password">
                    <i class="far fa-copy"></i>
                </button>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // Add clear history button
        const clearBtnContainer = document.createElement('div');
        clearBtnContainer.className = 'clear-history';
        clearBtnContainer.innerHTML = '<button id="clear-history-btn">Clear History</button>';
        historyList.appendChild(clearBtnContainer);
        
        // Add event listeners to copy buttons
        document.querySelectorAll('.copy-history-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const password = passwordHistoryData[index].password;
                navigator.clipboard.writeText(password);
                
                // Visual feedback
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.color = '#4CAF50';
                setTimeout(() => {
                    this.innerHTML = '<i class="far fa-copy"></i>';
                    this.style.color = '';
                }, 1000);
            });
        });
        
        // Add event listener to clear history button
        document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
    }
    
    function maskPassword(password) {
        return '•'.repeat(password.length);
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear all password history?')) {
            passwordHistoryData = [];
            localStorage.removeItem('passwordHistory');
            updatePasswordHistory();
        }
    }
    
    // Generate initial password
    generatePassword();
});
