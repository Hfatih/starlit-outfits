// Starlit Login Page JavaScript

// Show/Hide Info Popup
function showInfoPopup() {
    document.getElementById('infoPopup').classList.add('show');
}

function closeInfoPopup() {
    document.getElementById('infoPopup').classList.remove('show');
}

// Close popup when clicking outside
document.getElementById('infoPopup')?.addEventListener('click', function (e) {
    if (e.target === this) {
        closeInfoPopup();
    }
});

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('errorMessage');

    // Hide previous error
    errorDiv.classList.remove('show');

    try {
        // Wait for StarlitDB to be ready
        await waitForDB();

        // Find user
        const user = StarlitDB.getUserByUsername(username);

        if (!user) {
            showError('Kullanıcı bulunamadı!');
            return;
        }

        if (user.password !== password) {
            showError('Şifre hatalı!');
            return;
        }

        // Check if user is banned
        if (user.banned) {
            showError('Bu hesap yasaklanmış!');
            return;
        }

        // Login successful
        const sessionData = {
            loggedIn: true,
            username: user.username,
            role: user.role,
            avatar: user.avatar || user.username.substring(0, 2).toUpperCase(),
            userId: user.id
        };

        // Save session
        if (rememberMe) {
            localStorage.setItem('starlitUser', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('starlitUser', JSON.stringify(sessionData));
        }

        // Redirect to home
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Login error:', error);
        showError('Bir hata oluştu, lütfen tekrar deneyin.');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorDiv.classList.add('show');
}

// Wait for database to be ready
function waitForDB() {
    return new Promise((resolve) => {
        if (typeof StarlitDB !== 'undefined' && StarlitDB._cache) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (typeof StarlitDB !== 'undefined' && StarlitDB._cache) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 5000);
        }
    });
}

// Load Discord URL from settings
document.addEventListener('DOMContentLoaded', async function () {
    await waitForDB();

    // Update Discord link if settings available
    if (StarlitDB?.settings?.discordInviteUrl) {
        const discordLink = document.getElementById('discordLink');
        if (discordLink) {
            discordLink.href = StarlitDB.settings.discordInviteUrl;
        }
    }

    // Check if already logged in
    const session = JSON.parse(sessionStorage.getItem('starlitUser') || localStorage.getItem('starlitUser') || 'null');
    if (session && session.loggedIn) {
        window.location.href = 'index.html';
    }
});
