// STARLIT - COMPREHENSIVE DATABASE & AUTH SYSTEM
const StarlitDB = {
    // Users with roles and profiles
    users: [
        { id: 1, username: 'ByFatih', password: '123456', email: 'byfatih@example.com', role: 'admin', avatar: 'BY', avatarUrl: null, createdAt: '2024-12-15' },
        { id: 2, username: 'xRiot', password: '123456', email: 'xriot@example.com', role: 'moderator', avatar: 'XR', avatarUrl: null, createdAt: '2024-12-20' },
        { id: 3, username: 'BeachQueen', password: '123456', email: 'beach@example.com', role: 'user', avatar: 'BQ', avatarUrl: null, createdAt: '2024-12-23' },
        { id: 4, username: 'Edward_Lucania', password: '123456', email: 'edward@example.com', role: 'user', avatar: 'EL', avatarUrl: null, createdAt: '2024-12-22' },
        { id: 5, username: 'SummerGirl', password: '123456', email: 'summer@example.com', role: 'user', avatar: 'SG', avatarUrl: null, createdAt: '2024-12-25' }
    ],

    // Content (kombinler, yüzler)
    content: [
        { id: 1, type: 'kombin', title: 'Yazlık Elbise Kombini', description: 'Yaz mevsimi için ideal', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', creatorId: 5, category: 'kadin', status: 'approved', likes: 156, views: 1240, comments: 24, createdAt: '2024-12-01', approvedAt: '2024-12-01' },
        { id: 2, type: 'kombin', title: 'Casual Erkek Stil', description: 'Günlük rahat kombin', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', creatorId: 4, category: 'erkek', status: 'approved', likes: 142, views: 980, comments: 18, createdAt: '2024-12-05', approvedAt: '2024-12-05' },
        { id: 3, type: 'kombin', title: 'Plaj Kombini', description: 'Sahil için mükemmel', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', creatorId: 3, category: 'kadin', status: 'approved', likes: 198, views: 1560, comments: 32, createdAt: '2024-12-08', approvedAt: '2024-12-08' },
        { id: 4, type: 'kombin', title: 'Gece Elbisesi', description: 'Özel geceler için', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400', creatorId: 2, category: 'kadin', status: 'approved', likes: 234, views: 2100, comments: 45, createdAt: '2024-12-10', approvedAt: '2024-12-10' },
        { id: 5, type: 'kombin', title: 'Spor Şık', description: 'Spordan sonra şık görünüm', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400', creatorId: 1, category: 'kadin', status: 'approved', likes: 178, views: 1320, comments: 28, createdAt: '2024-12-12', approvedAt: '2024-12-12' },
        { id: 6, type: 'yuz', title: 'Doğal Güzellik', description: 'Doğal kadın yüzü', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', creatorId: 3, category: 'kadin', status: 'approved', likes: 89, views: 650, comments: 12, createdAt: '2024-12-15', approvedAt: '2024-12-15' },
        { id: 7, type: 'yuz', title: 'Cool Guy', description: 'Modern erkek yüzü', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', creatorId: 4, category: 'erkek', status: 'approved', likes: 76, views: 520, comments: 8, createdAt: '2024-12-18', approvedAt: '2024-12-18' },
        { id: 8, type: 'kombin', title: 'Kış Kombini', description: 'Soğuk günler için', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', creatorId: 5, category: 'kadin', status: 'pending', likes: 0, views: 0, comments: 0, createdAt: '2024-12-28', approvedAt: null },
        { id: 9, type: 'yuz', title: 'Elegant Lady', description: 'Zarif kadın yüzü', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', creatorId: 2, category: 'kadin', status: 'pending', likes: 0, views: 0, comments: 0, createdAt: '2024-12-28', approvedAt: null }
    ],

    // Animation topics
    topics: [
        { id: 0, title: 'ANİMASYON KISAYOL', code: 'Dans Animasyonları', pinned: true, locked: false, creatorId: 1, image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400' },
        { id: 1, title: 'femalepose (1-376)', code: 'femalepose', pinned: false, locked: true, creatorId: 2, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' },
        { id: 2, title: 'malepose (1-105)', code: 'malepose', pinned: false, locked: false, creatorId: 1, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
        { id: 3, title: 'SIT (1-36)', code: 'sit', pinned: false, locked: false, creatorId: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }
    ],

    // Messages per topic
    messages: {
        0: [{ userId: 2, text: 'Dans animasyonları listesi', image: null, time: '30+ gün önce' }],
        1: [
            { userId: 2, text: 'femalepose40', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop', time: '30+ gün önce' },
            { userId: 2, text: 'femalepose41', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop', time: '30+ gün önce' }
        ],
        2: [{ userId: 1, text: 'malepose1', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop', time: '30+ gün önce' }],
        3: [{ userId: 3, text: 'sit1', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop', time: '30+ gün önce' }]
    },

    // Reports
    reports: [
        { id: 1, contentId: 3, reporterId: 4, reason: 'Uygunsuz içerik', status: 'pending', createdAt: '2024-12-27' },
        { id: 2, contentId: 5, reporterId: 3, reason: 'Kopya içerik', status: 'pending', createdAt: '2024-12-28' }
    ],

    // Notifications
    notifications: [
        { id: 1, userId: 1, type: 'like', message: 'xRiot kombinini beğendi', read: false, createdAt: '2024-12-29T17:00:00' },
        { id: 2, userId: 1, type: 'comment', message: 'BeachQueen yorum yaptı', read: false, createdAt: '2024-12-29T16:00:00' },
        { id: 3, userId: 1, type: 'approve', message: 'Kombininiz onaylandı', read: false, createdAt: '2024-12-29T15:00:00' }
    ],

    // Moderator permissions
    moderatorPermissions: {
        canApproveContent: true,
        canDeleteContent: true,
        canLockTopics: true,
        canBanUsers: false,
        canEditUsers: false
    },

    // Site settings
    settings: {
        siteName: 'Starlit',
        siteDescription: 'En iyi kıyafet kombinlerini keşfedin',
        discordInviteUrl: 'https://discord.gg/starlit',
        primaryColor: '#8b5cf6',
        secondaryColor: '#ec4899',
        maintenanceMode: false,
        maintenanceEstimate: '30 Dakika',
        notifyUploads: true,
        bannedWords: []
    },

    // User settings (per user)
    userSettings: {},

    // Initialize from localStorage
    init: function () {
        const saved = localStorage.getItem('starlitDatabase');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                if (this[key] !== undefined && key !== 'init' && key !== 'save') {
                    this[key] = data[key];
                }
            });
        }
        // Check maintenance mode (skip for admin pages)
        this.checkMaintenanceMode();
        // Apply theme colors
        this.applyThemeColors();
    },

    // Check maintenance mode
    checkMaintenanceMode: function () {
        if (this.settings.maintenanceMode) {
            const currentPage = window.location.pathname.split('/').pop();
            // Allow admin and login pages
            if (currentPage !== 'admin.html' && currentPage !== 'giris.html' && currentPage !== 'bakim.html') {
                // Check if user is admin or moderator
                const user = this.getCurrentUser();
                if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
                    window.location.href = 'bakim.html';
                }
            }
        }
    },

    // Apply theme colors
    applyThemeColors: function () {
        let primary = this.settings.primaryColor;
        let secondary = this.settings.secondaryColor;

        const user = this.getCurrentUser();

        if (user && this.userSettings[user.id]?.theme) {
            primary = this.userSettings[user.id].theme.primary;
            secondary = this.userSettings[user.id].theme.secondary;
        }

        document.documentElement.style.setProperty('--accent-purple', primary);
        document.documentElement.style.setProperty('--accent-pink', secondary);
    },

    // Save to localStorage
    save: function () {
        const data = {};
        Object.keys(this).forEach(key => {
            if (typeof this[key] !== 'function') {
                data[key] = this[key];
            }
        });
        localStorage.setItem('starlitDatabase', JSON.stringify(data));
    },

    // Get user by ID
    getUser: function (id) {
        return this.users.find(u => u.id === id);
    },

    // Get current user
    getCurrentUser: function () {
        const session = JSON.parse(sessionStorage.getItem('starlitUser') || localStorage.getItem('starlitUser') || 'null');
        if (session && session.loggedIn) {
            return this.users.find(u => u.username === session.username);
        }
        return null;
    },

    // Check if admin
    isAdmin: function () {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    // Check if moderator or admin
    isModerator: function () {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'moderator');
    },

    // Content methods
    getContent: function (type = 'all', status = 'approved') {
        return this.content.filter(c =>
            (type === 'all' || c.type === type) &&
            (status === 'all' || c.status === status)
        );
    },

    getTopLiked: function (limit = 10) {
        return this.content
            .filter(c => c.status === 'approved')
            .sort((a, b) => b.likes - a.likes)
            .slice(0, limit);
    },

    getFeatured: function (limit = 3) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return this.content
            .filter(c => c.status === 'approved' && new Date(c.createdAt) >= oneMonthAgo)
            .sort((a, b) => b.views - a.views)
            .slice(0, limit);
    },

    getPending: function () {
        return this.content.filter(c => c.status === 'pending');
    },

    approveContent: function (id) {
        const item = this.content.find(c => c.id === id);
        if (item && this.isModerator()) {
            item.status = 'approved';
            item.approvedAt = new Date().toISOString().split('T')[0];
            this.save();
            return true;
        }
        return false;
    },

    rejectContent: function (id) {
        const item = this.content.find(c => c.id === id);
        if (item && this.isModerator()) {
            item.status = 'rejected';
            this.save();
            return true;
        }
        return false;
    },

    likeContent: function (id) {
        const item = this.content.find(c => c.id === id);
        const user = this.getCurrentUser();
        if (item) {
            item.likes++;
            // Notify content owner
            if (user && item.creatorId !== user.id) {
                this.addNotification(item.creatorId, 'like', `${user.username} içeriğini beğendi`);
            }
            this.save();
            return item.likes;
        }
        return 0;
    },

    viewContent: function (id) {
        const item = this.content.find(c => c.id === id);
        if (item) {
            item.views++;
            this.save();
        }
    },

    // Topic methods
    canUserWrite: function (topicId) {
        const user = this.getCurrentUser();
        const topic = this.topics.find(t => t.id === topicId);
        if (!user || !topic) return false;
        if (topic.locked) {
            return user.role === 'admin' || user.role === 'moderator';
        }
        return true;
    },

    toggleTopicLock: function (topicId) {
        const topic = this.topics.find(t => t.id === topicId);
        if (topic && this.isModerator()) {
            topic.locked = !topic.locked;
            this.save();
            return topic.locked;
        }
        return null;
    },

    addMessage: function (topicId, text, image = null) {
        const user = this.getCurrentUser();
        if (!user || !this.canUserWrite(topicId)) return false;

        if (!this.messages[topicId]) this.messages[topicId] = [];
        this.messages[topicId].push({
            userId: user.id,
            text,
            image,
            time: 'Şimdi'
        });
        this.save();
        return true;
    },

    // Profile methods
    updateAvatar: function (avatarUrl) {
        const user = this.getCurrentUser();
        if (user) {
            user.avatarUrl = avatarUrl;
            this.save();
            return true;
        }
        return false;
    },

    // Notification methods
    getNotifications: function () {
        const user = this.getCurrentUser();
        if (!user) return [];
        return this.notifications.filter(n => n.userId === user.id);
    },

    markAllRead: function () {
        const user = this.getCurrentUser();
        if (user) {
            this.notifications.forEach(n => {
                if (n.userId === user.id) n.read = true;
            });
            this.save();
        }
    },

    getUnreadCount: function () {
        const user = this.getCurrentUser();
        if (!user) return 0;
        return this.notifications.filter(n => n.userId === user.id && !n.read).length;
    },

    // Add notification and play sound
    addNotification: function (userId, type, message) {
        const newNotif = {
            id: this.notifications.length + 1,
            userId,
            type,
            message,
            read: false,
            createdAt: new Date().toISOString()
        };
        this.notifications.push(newNotif);
        this.save();
        this.playNotificationSound();
        return newNotif;
    },

    // Play notification sound at 75% volume
    playNotificationSound: function () {
        try {
            const audio = new Audio('notificationstarlit.mp3');
            audio.volume = 0.75;
            audio.play().catch(e => console.log('Audio play prevented:', e));
        } catch (e) {
            console.log('Audio error:', e);
        }
    },

    // Report methods
    getReports: function (status = 'all') {
        if (status === 'all') return this.reports;
        return this.reports.filter(r => r.status === status);
    },

    resolveReport: function (id, action) {
        const report = this.reports.find(r => r.id === id);
        if (report && this.isModerator()) {
            report.status = action; // 'resolved' or 'dismissed'
            this.save();
            return true;
        }
        return false;
    },

    // Search
    search: function (query, type = 'all') {
        const q = query.toLowerCase();
        return this.content.filter(c =>
            (type === 'all' || c.type === type) &&
            c.status === 'approved' &&
            (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
        );
    },

    searchUsers: function (query) {
        const q = query.toLowerCase();
        return this.users.filter(u =>
            u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
    }
};

// Initialize on load
StarlitDB.init();

// Auth functions
function logout() {
    sessionStorage.removeItem('starlitUser');
    localStorage.removeItem('starlitUser');
    window.location.href = 'giris.html';
}

function checkAuth() {
    const user = StarlitDB.getCurrentUser();
    if (!user) {
        window.location.href = 'giris.html';
        return false;
    }
    return true;
}

// Hide admin/mod elements for regular users
function updateUIForRole() {
    const user = StarlitDB.getCurrentUser();
    const adminBtns = document.querySelectorAll('.admin-btn');

    adminBtns.forEach(btn => {
        if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
            btn.style.display = 'none';
        }
    });
}

// Global avatar update function - updates header avatar and all user's avatars on all pages
function updateHeaderAvatar() {
    const user = StarlitDB.getCurrentUser();
    if (!user) return;

    // Update all .user-avatar elements in header and admin panel
    document.querySelectorAll('.header .user-avatar, .header-actions .user-avatar, .admin-user .user-avatar').forEach(avatar => {
        if (user.avatarUrl) {
            avatar.style.backgroundImage = `url(${user.avatarUrl})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.textContent = '';
        } else {
            avatar.style.backgroundImage = '';
            avatar.textContent = user.avatar;
        }
    });

    // Update username display
    document.querySelectorAll('.header .user-name, .header-actions .user-name, .admin-user .user-name').forEach(el => {
        el.textContent = user.username;
    });
}

// Helper function to render any user's avatar HTML
function renderUserAvatar(userId) {
    const user = StarlitDB.getUser(userId);
    if (!user) return '<div class="user-avatar">??</div>';

    if (user.avatarUrl) {
        return `<div class="user-avatar" style="background-image: url(${user.avatarUrl}); background-size: cover; background-position: center;"></div>`;
    } else {
        return `<div class="user-avatar">${user.avatar}</div>`;
    }
}

// Get avatar style for a user (returns inline style string or text content)
function getUserAvatarData(userId) {
    const user = StarlitDB.getUser(userId);
    if (!user) return { text: '??', style: '' };

    if (user.avatarUrl) {
        return {
            text: '',
            style: `background-image: url(${user.avatarUrl}); background-size: cover; background-position: center;`
        };
    } else {
        return { text: user.avatar, style: '' };
    }
}

// Notification system
function initNotifications() {
    const btn = document.getElementById('notificationBtn');
    const dropdown = document.getElementById('notificationDropdown');
    const markAllRead = document.getElementById('markAllRead');
    const badge = document.getElementById('notifBadge');
    const notifList = dropdown?.querySelector('.notif-list');

    // Update badge
    const count = StarlitDB.getUnreadCount();
    if (badge) {
        badge.textContent = count;
        badge.style.display = count === 0 ? 'none' : 'flex';
    }

    // Populate notification list
    if (notifList) {
        const notifications = StarlitDB.getNotifications();
        if (notifications.length === 0) {
            notifList.innerHTML = '<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>Bildirim yok</p></div>';
        } else {
            notifList.innerHTML = notifications.slice(0, 10).map(notif => {
                const iconClass = notif.type === 'like' ? 'like' : notif.type === 'comment' ? 'comment' : 'approve';
                const icon = notif.type === 'like' ? 'fa-heart' : notif.type === 'comment' ? 'fa-comment' : 'fa-check-circle';
                const timeAgo = formatTimeAgo(notif.createdAt);
                return `
                    <div class="notif-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
                        <div class="notif-icon ${iconClass}"><i class="fas ${icon}"></i></div>
                        <div class="notif-content">
                            <p>${notif.message}</p>
                            <span class="notif-time">${timeAgo}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown?.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown?.contains(e.target) && e.target !== btn) {
            dropdown?.classList.remove('active');
        }
    });

    markAllRead?.addEventListener('click', () => {
        StarlitDB.markAllRead();
        document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
    });
}

// Helper function to format time ago
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return `${Math.floor(diffDays / 30)} ay önce`;
}

// Settings modal
function initSettingsModal() {
    const settingsBtn = document.querySelector('.settings-btn');
    let modal = document.getElementById('userSettingsModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'userSettingsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content settings-modal-content">
                <button class="modal-close" onclick="this.parentElement.parentElement.classList.remove('active')"><i class="fas fa-times"></i></button>
                <h2><i class="fas fa-cog"></i> Ayarlar</h2>
                <div class="settings-tabs">
                    <button class="settings-tab active" data-tab="profile">Profil</button>
                    <button class="settings-tab" data-tab="notifications">Bildirimler</button>
                    <button class="settings-tab" data-tab="privacy">Gizlilik</button>
                    <button class="settings-tab" data-tab="theme">Tema</button>
                </div>
                <div class="settings-content">
                    <div class="settings-panel active" id="profilePanel">
                        <div class="avatar-upload">
                            <div class="current-avatar" id="currentAvatar"></div>
                            <button class="change-avatar-btn" id="changeAvatarBtn"><i class="fas fa-camera"></i> Fotoğraf Değiştir</button>
                            <input type="file" id="avatarInput" accept="image/*,.gif" hidden>
                            <p class="avatar-hint">PNG, JPG veya GIF (Max 2MB)</p>
                        </div>
                        <div class="form-group">
                            <label>Kullanıcı Adı</label>
                            <input type="text" id="settingsUsername" readonly>
                        </div>
                        <div class="form-group">
                            <label>E-posta</label>
                            <input type="email" id="settingsEmail">
                        </div>
                    </div>
                    <div class="settings-panel" id="notificationsPanel">
                        <div class="setting-item">
                            <label>Beğeni Bildirimleri</label>
                            <label class="toggle"><input type="checkbox" id="notifLikes" checked><span class="toggle-slider"></span></label>
                        </div>
                        <div class="setting-item">
                            <label>Yorum Bildirimleri</label>
                            <label class="toggle"><input type="checkbox" id="notifComments" checked><span class="toggle-slider"></span></label>
                        </div>
                        <div class="setting-item">
                            <label>Onay Bildirimleri</label>
                            <label class="toggle"><input type="checkbox" id="notifApprove" checked><span class="toggle-slider"></span></label>
                        </div>
                    </div>
                    <div class="settings-panel" id="privacyPanel">
                        <div class="setting-item">
                            <label>Profilimi Gizle</label>
                            <label class="toggle"><input type="checkbox" id="privacyHideProfile"><span class="toggle-slider"></span></label>
                        </div>
                        <div class="setting-item">
                            <label>Beğenilerimi Gizle</label>
                            <label class="toggle"><input type="checkbox" id="privacyHideLikes"><span class="toggle-slider"></span></label>
                        </div>
                    </div>
                    <div class="settings-panel" id="themePanel">
                        <div class="setting-item">
                            <label>Ana Renk</label>
                            <input type="color" id="themePrimary" value="#8b5cf6">
                        </div>
                        <div class="setting-item">
                            <label>İkinci Renk</label>
                            <input type="color" id="themeSecondary" value="#ec4899">
                        </div>
                        <button class="secondary-btn" id="resetThemeBtn" style="margin-top: 10px; width: 100%;">
                            <i class="fas fa-undo"></i> Varsayılana Dön
                        </button>
                    </div>
                </div>
                <button class="save-settings-btn" id="saveUserSettings"><i class="fas fa-save"></i> Kaydet</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Tab switching
        modal.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab + 'Panel').classList.add('active');
            });
        });

        // Avatar upload
        const avatarInput = document.getElementById('avatarInput');
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const currentAvatar = document.getElementById('currentAvatar');

        changeAvatarBtn?.addEventListener('click', () => avatarInput?.click());
        avatarInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.size <= 2 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    StarlitDB.updateAvatar(ev.target.result);
                    currentAvatar.style.backgroundImage = `url(${ev.target.result})`;
                    currentAvatar.style.backgroundSize = 'cover';
                    currentAvatar.textContent = '';
                    updateHeaderAvatar(); // Update header immediately
                };
                reader.readAsDataURL(file);
            }
        });

        // Reset Theme
        document.getElementById('resetThemeBtn')?.addEventListener('click', () => {
            document.getElementById('themePrimary').value = StarlitDB.settings.primaryColor;
            document.getElementById('themeSecondary').value = StarlitDB.settings.secondaryColor;
        });

        // Save settings
        document.getElementById('saveUserSettings')?.addEventListener('click', () => {
            const user = StarlitDB.getCurrentUser();
            if (user) {
                // Save theme settings
                if (!StarlitDB.userSettings[user.id]) StarlitDB.userSettings[user.id] = {};

                StarlitDB.userSettings[user.id].theme = {
                    primary: document.getElementById('themePrimary').value,
                    secondary: document.getElementById('themeSecondary').value
                };

                StarlitDB.applyThemeColors();
                StarlitDB.save();
            }

            modal.classList.remove('active');
            showToast?.('Ayarlar kaydedildi!');
        });
    }

    settingsBtn?.addEventListener('click', () => {
        const user = StarlitDB.getCurrentUser();
        if (user) {
            document.getElementById('settingsUsername').value = user.username;
            document.getElementById('settingsEmail').value = user.email;

            // Load theme settings
            let pColor = StarlitDB.settings.primaryColor;
            let sColor = StarlitDB.settings.secondaryColor;

            if (StarlitDB.userSettings[user.id]?.theme) {
                pColor = StarlitDB.userSettings[user.id].theme.primary;
                sColor = StarlitDB.userSettings[user.id].theme.secondary;
            }

            const tPrimary = document.getElementById('themePrimary');
            const tSecondary = document.getElementById('themeSecondary');

            if (tPrimary) tPrimary.value = pColor;
            if (tSecondary) tSecondary.value = sColor;

            const avatar = document.getElementById('currentAvatar');
            if (user.avatarUrl) {
                avatar.style.backgroundImage = `url(${user.avatarUrl})`;
            } else {
                avatar.textContent = user.avatar;
            }
        }
        modal.classList.add('active');
    });
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initNotifications();
    initSettingsModal();
    updateUIForRole();
    updateHeaderAvatar();
});
