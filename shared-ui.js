// Shared UI Logic for Starlit Outfits
// Handles Header User Display and Notifications globally

document.addEventListener('DOMContentLoaded', () => {
    // Wait for DB to be ready
    if (window.StarlitDB && StarlitDB.ready) {
        initSharedUI();
    } else {
        document.addEventListener('starlit-ready', initSharedUI);
    }
});

function initSharedUI() {
    initUserDisplay();
    renderNotifications();
    initLogout();
}

function initUserDisplay() {
    const user = StarlitDB?.getCurrentUser();

    // Header user display
    const headerAvatar = document.getElementById('headerUserAvatar');
    const headerName = document.getElementById('headerUserName');
    const userProfileDiv = document.querySelector('.user-profile'); // Select container for click event

    // Welcome section (only on index)
    const welcomeAvatar = document.getElementById('welcomeAvatar');
    const welcomeName = document.getElementById('welcomeName');

    if (user) {
        const avatarText = user.avatar || user.username.substring(0, 2).toUpperCase();

        // Update header
        if (headerAvatar) {
            if (user.avatarUrl) {
                headerAvatar.textContent = '';
                headerAvatar.style.backgroundImage = `url(${user.avatarUrl})`;
                headerAvatar.style.backgroundSize = 'cover';
                headerAvatar.style.backgroundPosition = 'center';
            } else {
                headerAvatar.textContent = avatarText;
                headerAvatar.style.backgroundImage = 'none';
            }
        }
        if (headerName) headerName.textContent = user.username;

        // Update welcome section
        if (welcomeAvatar) {
            if (user.avatarUrl) {
                welcomeAvatar.textContent = '';
                welcomeAvatar.style.backgroundImage = `url(${user.avatarUrl})`;
                welcomeAvatar.style.backgroundSize = 'cover';
                welcomeAvatar.style.backgroundPosition = 'center';
            } else {
                welcomeAvatar.textContent = avatarText;
                welcomeAvatar.style.backgroundImage = 'none';
            }
        }
        if (welcomeName) welcomeName.textContent = user.username;

        // Show/hide admin button based on role
        const adminBtn = document.querySelector('.admin-btn');
        if (adminBtn) {
            adminBtn.style.display = (user.role === 'admin' || user.role === 'moderator') ? 'flex' : 'none';
        }
    } else {
        // Not logged in
        if (headerName) headerName.textContent = 'Giriş Yap';
        if (headerAvatar) headerAvatar.textContent = '?';
        if (welcomeName) welcomeName.textContent = 'Ziyaretçi';
        if (welcomeAvatar) welcomeAvatar.textContent = '?';

        // Make user profile clickable to login
        if (userProfileDiv) {
            userProfileDiv.style.cursor = 'pointer';
            userProfileDiv.onclick = () => window.location.href = 'giris.html';
        }
    }
}

function renderNotifications() {
    const list = document.querySelector('.notif-list'); // Use class selector as it's common
    const badge = document.getElementById('notifBadge');

    // Also handle notification dropdown toggle
    const notifBtn = document.getElementById('notificationBtn');
    const notifDropdown = document.getElementById('notificationDropdown');

    if (notifBtn && notifDropdown) {
        // Remove old listeners to prevent duplicates (though typical init runs once)
        const newBtn = notifBtn.cloneNode(true);
        notifBtn.parentNode.replaceChild(newBtn, notifBtn);

        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !newBtn.contains(e.target)) {
                notifDropdown.classList.remove('active');
            }
        });
    }

    if (!list) return;

    // Get real notifications (mockup for now, or DB implemented)
    // For now, we'll show empty state or fetch from a 'notifications' collection if it existed
    // Since notifications aren't fully in DB yet, we'll use a local mock or empty state

    // Clear list
    list.innerHTML = '';

    // Empty state
    list.innerHTML = `
        <div class="notif-item" data-id="welcome">
            <div class="notif-icon approve"><i class="fas fa-check"></i></div>
            <div class="notif-content">
                <p>Henüz bildirim yok</p>
                <span class="notif-time">-</span>
            </div>
        </div>
    `;

    if (badge) badge.textContent = '0';
}

function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        const newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);

        newBtn.addEventListener('click', () => {
            StarlitDB.logout();
            window.location.href = 'giris.html';
        });
    }
}
