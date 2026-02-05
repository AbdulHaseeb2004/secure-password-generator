document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const welcomeScreen = document.getElementById('welcome-screen');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Login form elements
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const loginPasswordStrength = document.getElementById('login-password-strength');
    
    // Register form elements
    const registerUsername = document.getElementById('register-username');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const registerConfirmPassword = document.getElementById('register-confirm-password');
    const toggleRegisterPassword = document.getElementById('toggle-register-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const registerPasswordStrength = document.getElementById('register-password-strength');
    
    // Password requirement elements
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqSymbol = document.getElementById('req-symbol');
    const reqMatch = document.getElementById('req-match');
    
    // Welcome screen elements
    const welcomeUsername = document.getElementById('welcome-username');
    const infoUsername = document.getElementById('info-username');
    const infoEmail = document.getElementById('info-email');
    const infoJoined = document.getElementById('info-joined');
    
    // User data storage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    // Initialize
    checkCurrentUser();
    
    // Event Listeners
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('register');
    });
    
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('login');
    });
    
    toggleLoginPassword.addEventListener('click', function() {
        togglePasswordVisibility(loginPassword, this);
    });
    
    toggleRegisterPassword.addEventListener('click', function() {
        togglePasswordVisibility(registerPassword, this);
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(registerConfirmPassword, this);
    });
    
    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Password input listeners for real-time validation
    registerPassword.addEventListener('input', validateRegisterPassword);
    registerConfirmPassword.addEventListener('input', validatePasswordMatch);
    loginPassword.addEventListener('input', updateLoginPasswordStrength);
    
    // Functions
    function checkCurrentUser() {
        if (currentUser) {
            showWelcomeScreen(currentUser);
        } else {
            showForm('login');
        }
    }
    
    function showForm(formType) {
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        welcomeScreen.style.display = 'none';
        
        if (formType === 'login') {
            loginForm.classList.add('active');
        } else if (formType === 'register') {
            registerForm.classList.add('active');
        }
    }
    
    function showWelcomeScreen(user) {
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        welcomeScreen.style.display = 'block';
        
        welcomeUsername.textContent = user.username;
        infoUsername.textContent = user.username;
        infoEmail.textContent = user.email;
        infoJoined.textContent = new Date(user.joined).toLocaleDateString();
    }
    
    function togglePasswordVisibility(passwordField, toggleBtn) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Update eye icon
        const icon = toggleBtn.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
    
    function validateRegisterPassword() {
        const password = registerPassword.value;
        
        // Check requirements
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
        
        // Update requirement indicators
        updateRequirement(reqLength, hasLength);
        updateRequirement(reqUppercase, hasUppercase);
        updateRequirement(reqLowercase, hasLowercase);
        updateRequirement(reqNumber, hasNumber);
        updateRequirement(reqSymbol, hasSymbol);
        
        // Update password strength
        updatePasswordStrength(password, registerPasswordStrength);
        
        // Validate password match
        validatePasswordMatch();
    }
    
    function validatePasswordMatch() {
        const password = registerPassword.value;
        const confirmPassword = registerConfirmPassword.value;
        const passwordsMatch = password === confirmPassword && password.length > 0;
        
        updateRequirement(reqMatch, passwordsMatch);
    }
    
    function updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }
    
    function updatePasswordStrength(password, strengthElement) {
        let score = 0;
        
        // Length contributes up to 25 points
        score += Math.min(password.length * 3, 25);
        
        // Character variety contributes up to 75 points
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 15;
        
        // Deduct for consecutive characters
        const consecutiveChars = /(.)\1{2,}/.test(password);
        if (consecutiveChars) score -= 10;
        
        // Deduct for common patterns
        const commonPatterns = /(123|abc|password|admin|qwerty)/i.test(password);
        if (commonPatterns) score -= 20;
        
        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(score, 100));
        
        // Update strength bar and text
        const strengthBar = strengthElement.querySelector('.strength-bar');
        const strengthText = strengthElement.querySelector('.strength-text');
        
        strengthBar.style.width = `${score}%`;
        
        let strengthLevel, strengthColor;
        
        if (score < 30) {
            strengthLevel = 'Very Weak';
            strengthColor = '#ff4757';
        } else if (score < 50) {
            strengthLevel = 'Weak';
            strengthColor = '#ff6b6b';
        } else if (score < 70) {
            strengthLevel = 'Medium';
            strengthColor = '#ffa502';
        } else if (score < 85) {
            strengthLevel = 'Strong';
            strengthColor = '#2ed573';
        } else {
            strengthLevel = 'Very Strong';
            strengthColor = '#00d2d3';
        }
        
        strengthBar.style.backgroundColor = strengthColor;
        strengthText.textContent = `Password strength: ${strengthLevel}`;
        strengthText.style.color = strengthColor;
    }
    
    function updateLoginPasswordStrength() {
        updatePasswordStrength(loginPassword.value, loginPasswordStrength);
    }
    
    function handleLogin() {
        const username = loginUsername.value.trim();
        const password = loginPassword.value;
        
        // Basic validation
        if (!username || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        // Find user
        const user = users.find(u => u.username === username);
        
        if (!user) {
            showAlert('User not found', 'error');
            return;
        }
        
        // In a real app, you would hash the password and compare with stored hash
        // For this demo, we'll do a simple comparison
        if (user.password !== password) {
            showAlert('Incorrect password', 'error');
            return;
        }
        
        // Login successful
        currentUser = {
            username: user.username,
            email: user.email,
            joined: user.joined
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show welcome screen
        showWelcomeScreen(currentUser);
        
        // Reset form
        loginUsername.value = '';
        loginPassword.value = '';
        
        showAlert('Login successful!', 'success');
    }
    
    function handleRegister() {
        const username = registerUsername.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value;
        const confirmPassword = registerConfirmPassword.value;
        
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }
        
        // Validate password
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
        const passwordsMatch = password === confirmPassword;
        
        if (!hasLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSymbol || !passwordsMatch) {
            showAlert('Please ensure all password requirements are met', 'error');
            return;
        }
        
        // Check if username already exists
        const usernameExists = users.some(u => u.username === username);
        if (usernameExists) {
            showAlert('Username already exists', 'error');
            return;
        }
        
        // Check if email already exists
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            showAlert('Email already registered', 'error');
            return;
        }
        
        // In a real app, you would hash the password before storing
        // For this demo, we'll store it as-is (NOT recommended for production)
        const newUser = {
            username,
            email,
            password, // In production, hash this!
            joined: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login
        currentUser = {
            username: newUser.username,
            email: newUser.email,
            joined: newUser.joined
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show welcome screen
        showWelcomeScreen(currentUser);
        
        // Reset form
        registerUsername.value = '';
        registerEmail.value = '';
        registerPassword.value = '';
        registerConfirmPassword.value = '';
        
        showAlert('Registration successful! You are now logged in.', 'success');
    }
    
    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showForm('login');
        showAlert('Logged out successfully', 'success');
    }
    
    function showAlert(message, type) {
        // Remove any existing alert
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Style the alert
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.padding = '15px 25px';
        alert.style.borderRadius = '10px';
        alert.style.color = 'white';
        alert.style.fontWeight = '500';
        alert.style.zIndex = '1000';
        alert.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        alert.style.animation = 'slideIn 0.3s ease';
        
        if (type === 'success') {
            alert.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        } else {
            alert.style.background = 'linear-gradient(135deg, #ff4757, #ff6b6b)';
        }
        
        // Add to document
        document.body.appendChild(alert);
        
        // Remove after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 3000);
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize password validation
    validateRegisterPassword();
});
