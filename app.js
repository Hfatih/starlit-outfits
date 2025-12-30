// STARLIT - ANASAYFA APP.JS (Database integrated)
const featuredSlider = document.getElementById('featuredSlider');
const top10Grid = document.getElementById('top10Grid');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

let featuredInterval = null;
let currentFeaturedIndex = 0;
let featuredSpeed = 6000; // Slow default (6 seconds)
let currentPeriod = 'daily';
let isPlaying = true;

document.addEventListener('DOMContentLoaded', () => {
    // Determine if DB is ready
    if (window.StarlitDB && StarlitDB.ready) {
        initializeApp();
    } else {
        document.addEventListener('starlit-ready', initializeApp);
        // Fallback for slow load
        setTimeout(() => {
            if (!StarlitDB.ready) initializeApp();
        }, 2000);
    }
});

function initializeApp() {
    initUserDisplay();
    renderNotifications();
    loadDiscordUrl();
    renderBestOfWeek();
    renderFeaturedSlider(currentPeriod);
    renderTop10('kombinler');
    initTop10Tabs();
    initFeaturedControls();
    initViewAllNotifications();
}

// Initialize user display for header and welcome section
function initUserDisplay() {
    const user = StarlitDB?.getCurrentUser();

    // Header user display
    const headerAvatar = document.getElementById('headerUserAvatar');
    const headerName = document.getElementById('headerUserName');

    // Welcome section
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
                welcomeAvatar.style.backgroundImage = 'none'; // Reset gradient if needed, or keep CSS default
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
    }
}

// Render Notifications
function renderNotifications() {
    const list = document.getElementById('notifList');
    const badge = document.getElementById('notifBadge');
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

// Discord URL from settings
function loadDiscordUrl() {
    if (StarlitDB?.settings?.discordInviteUrl) {
        document.getElementById('discordBtn')?.setAttribute('href', StarlitDB.settings.discordInviteUrl);
        document.querySelectorAll('.footer-discord').forEach(el => el.href = StarlitDB.settings.discordInviteUrl);
    }
}

// View All Notifications button
function initViewAllNotifications() {
    const viewAllBtn = document.querySelector('.notif-footer a, .view-all-notif');
    viewAllBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'bildirimler.html';
    });

    document.querySelectorAll('[href="#all-notifications"]').forEach(link => {
        link.href = 'bildirimler.html';
    });
}

// Best of Week - Most viewed outfit
function renderBestOfWeek() {
    const bestCard = document.querySelector('.best-card');
    if (!bestCard) return;

    const mostViewed = StarlitDB.content
        .filter(c => c.status === 'approved' && c.type === 'kombin')
        .sort((a, b) => b.views - a.views)[0];

    if (mostViewed) {
        const creator = StarlitDB.getUser(mostViewed.creatorId);
        bestCard.innerHTML = `
            <img src="${mostViewed.image}" alt="${mostViewed.title}" class="best-image">
            <div class="best-info">
                <h3 class="best-title">Haftanın En İyisi</h3>
                <p class="best-outfit-name">"${mostViewed.title}"</p>
                <div class="best-creator">
                    <div class="creator-badge">${creator?.avatar || 'XX'}</div>
                    <span>${creator?.username || 'Bilinmeyen'}</span>
                </div>
                <div class="best-stats">
                    <span><i class="fas fa-heart"></i> ${mostViewed.likes} Beğeni</span>
                    <span><i class="fas fa-comment"></i> ${mostViewed.comments} Yorum</span>
                    <span><i class="fas fa-eye"></i> ${mostViewed.views} Görüntülenme</span>
                </div>
            </div>
        `;
    }
}

// Featured Slider - With time period filter
function renderFeaturedSlider(period = 'daily') {
    currentPeriod = period;
    const now = new Date();
    let filterDate = new Date();

    if (period === 'daily') {
        filterDate.setDate(now.getDate() - 1);
    } else if (period === 'weekly') {
        filterDate.setDate(now.getDate() - 7);
    } else {
        filterDate.setMonth(now.getMonth() - 1);
    }

    // Get content, try filtered first, fallback to all approved
    let featured = StarlitDB.content
        .filter(c => c.status === 'approved' && new Date(c.createdAt) >= filterDate)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10);

    // Fallback if no recent content
    if (featured.length === 0) {
        featured = StarlitDB.content
            .filter(c => c.status === 'approved')
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 10);
    }

    if (featuredSlider && featured.length > 0) {
        featuredSlider.innerHTML = featured.map(item => `
            <div class="featured-card" data-id="${item.id}" onclick="viewContent(${item.id}, '${item.type}')">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="featured-overlay">
                    <span class="featured-type">${item.type === 'kombin' ? 'Kombin' : 'Yüz'}</span>
                    <span class="featured-title">${item.title}</span>
                    <span class="featured-stats"><i class="fas fa-heart"></i> ${item.likes}</span>
                </div>
            </div>
        `).join('');

        currentFeaturedIndex = 0;
    }
}

function slideFeatured(direction) {
    const cards = featuredSlider.querySelectorAll('.featured-card');
    if (cards.length === 0) return;

    if (direction === 'next') {
        currentFeaturedIndex = (currentFeaturedIndex + 1) % cards.length;
    } else {
        currentFeaturedIndex = (currentFeaturedIndex - 1 + cards.length) % cards.length;
    }

    const scrollWidth = cards[0].offsetWidth + 16;
    featuredSlider.scrollTo({
        left: currentFeaturedIndex * scrollWidth,
        behavior: 'smooth'
    });
}

function initFeaturedControls() {
    const prevBtn = document.getElementById('featuredPrev');
    const nextBtn = document.getElementById('featuredNext');

    // Navigation arrows
    prevBtn?.addEventListener('click', () => slideFeatured('prev'));
    nextBtn?.addEventListener('click', () => slideFeatured('next'));

    // Period tabs (Günlük/Haftalık/Aylık)
    document.querySelectorAll('.featured-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.featured-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderFeaturedSlider(tab.dataset.period);
        });
    });
}

// Top 10 - Both kombinler AND yüzler with tabs
function renderTop10(type) {
    const topContent = StarlitDB.content
        .filter(c => c.status === 'approved')
        .sort((a, b) => b.likes - a.likes);

    let filtered;
    if (type === 'kombinler') {
        filtered = topContent.filter(c => c.type === 'kombin').slice(0, 10);
    } else if (type === 'yuzler') {
        filtered = topContent.filter(c => c.type === 'yuz').slice(0, 10);
    } else {
        filtered = topContent.slice(0, 10);
    }

    if (top10Grid) {
        if (filtered.length === 0) {
            top10Grid.innerHTML = '<p class="no-content">Henüz içerik yok.</p>';
            return;
        }

        top10Grid.innerHTML = filtered.map((item, index) => `
            <div class="top10-card" data-id="${item.id}" onclick="viewContent(${item.id}, '${item.type}')">
                <span class="top10-rank">${index + 1}</span>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="top10-overlay">
                    <span class="top10-type">${item.type === 'kombin' ? 'Kombin' : 'Yüz'}</span>
                    <span class="top10-title">${item.title}</span>
                    <span class="top10-stats"><i class="fas fa-heart"></i> ${item.likes}</span>
                </div>
            </div>
        `).join('');
    }
}

function initTop10Tabs() {
    document.querySelectorAll('.top10-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.top10-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTop10(tab.dataset.type);
        });
    });
}

function viewContent(id, type) {
    StarlitDB.viewContent(id);
    if (type === 'yuz') {
        window.location.href = `yuzler.html?id=${id}`;
    } else {
        window.location.href = `kombinler.html?id=${id}`;
    }
}

// Toast
function showToast(message) {
    if (toastMessage) toastMessage.textContent = message;
    toast?.classList.add('show');
    setTimeout(() => toast?.classList.remove('show'), 3000);
}
