// STARLIT - ADMIN PANEL JS (Database integrated)
let currentEditRow = null;
// deleteRow is handled below or scoped


const deleteRow = null; // Re-declare if needed or remove if used globally (let was previously used)

document.addEventListener('DOMContentLoaded', () => {
    // Determine if DB is ready
    if (window.StarlitDB && StarlitDB.ready) {
        initAdminPanel();
    } else {
        document.addEventListener('starlit-ready', initAdminPanel);
    }
});

function initAdminPanel() {
    // Check admin access first - redirect if not authorized
    if (!checkAdminAccess()) {
        return;
    }

    // Load current user info in admin header
    initAdminUser();
    // Also init shared UI stuff (notifications etc) if shared-ui.js is present
    if (typeof initSharedUI === 'function') initSharedUI();

    loadSettings();
    initNavigation();
    initGlobalSearch();
    initDashboard();
    initModeration();
    initReports();
    initUsers();
    initContent();
    initSettings();
    initThemeSettings();
    initNotifications();
}

// Check if current user has admin/mod access
function checkAdminAccess() {
    const user = StarlitDB.getCurrentUser();
    if (!user) {
        // Not logged in - redirect to home
        window.location.href = 'index.html';
        return false;
    }
    if (user.role !== 'admin' && user.role !== 'moderator') {
        // Not authorized - redirect to home
        alert('Bu sayfaya erişim yetkiniz yok.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize admin user display in header
function initAdminUser() {
    const user = StarlitDB.getCurrentUser();
    if (!user) return;

    const avatarEl = document.querySelector('.admin-user .user-avatar');
    const nameEl = document.querySelector('.admin-user .user-name');
    const roleEl = document.querySelector('.admin-user .user-role');

    if (nameEl) nameEl.textContent = user.username;
    if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Admin' : 'Moderatör';

    if (avatarEl) {
        if (user.avatarUrl) {
            avatarEl.style.backgroundImage = `url(${user.avatarUrl})`;
            avatarEl.style.backgroundSize = 'cover';
            avatarEl.style.backgroundPosition = 'center';
            avatarEl.textContent = '';
        } else {
            avatarEl.style.backgroundImage = '';
            avatarEl.textContent = user.avatar;
        }
    }
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            document.getElementById(section)?.classList.add('active');
        });
    });
}

// Global Search - works for entire admin panel
function initGlobalSearch() {
    const searchInput = document.querySelector('.admin-search input');
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'global-search-results';
    searchInput?.parentElement.appendChild(searchResultsContainer);

    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
            return;
        }

        const users = StarlitDB.searchUsers(query);
        const content = StarlitDB.search(query);
        const reports = StarlitDB.reports.filter(r =>
            r.reason.toLowerCase().includes(query) || r.status.includes(query)
        );

        let html = '';

        if (users.length > 0) {
            html += '<div class="search-category"><h4><i class="fas fa-users"></i> Kullanıcılar</h4>';
            users.slice(0, 3).forEach(u => {
                html += `<div class="search-result-item" onclick="goToSection('users', '${u.username}')">
                    <div class="user-avatar">${u.avatar}</div>
                    <span>${u.username}</span>
                    <span class="role-badge ${u.role}">${u.role}</span>
                </div>`;
            });
            html += '</div>';
        }

        if (content.length > 0) {
            html += '<div class="search-category"><h4><i class="fas fa-images"></i> İçerikler</h4>';
            content.slice(0, 3).forEach(c => {
                html += `<div class="search-result-item" onclick="goToSection('content', ${c.id})">
                    <img src="${c.image}" alt="" class="search-thumb">
                    <span>${c.title}</span>
                    <span class="status-badge ${c.status}">${c.status}</span>
                </div>`;
            });
            html += '</div>';
        }

        if (reports.length > 0) {
            html += '<div class="search-category"><h4><i class="fas fa-flag"></i> Raporlar</h4>';
            reports.slice(0, 3).forEach(r => {
                html += `<div class="search-result-item" onclick="goToSection('reports', ${r.id})">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${r.reason}</span>
                </div>`;
            });
            html += '</div>';
        }

        if (html === '') {
            html = '<div class="no-results">Sonuç bulunamadı</div>';
        }

        searchResultsContainer.innerHTML = html;
        searchResultsContainer.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        if (!searchInput?.contains(e.target) && !searchResultsContainer.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
}

window.goToSection = function (section, filter) {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section)?.classList.add('active');

    // Apply filter if provided
    if (section === 'users' && filter) {
        document.querySelector('.search-input').value = filter;
    }

    document.querySelector('.global-search-results').style.display = 'none';
    document.querySelector('.search-input').value = '';
};

// Dashboard with real data
function initDashboard() {
    // Update stats from database
    const stats = {
        kombins: StarlitDB.getContent('kombin', 'approved').length,
        faces: StarlitDB.getContent('yuz', 'approved').length,
        users: StarlitDB.users.length,
        pending: StarlitDB.getPending().length
    };

    document.querySelectorAll('.stat-card').forEach((card, index) => {
        const num = card.querySelector('.stat-number');
        if (num) {
            if (index === 0) num.textContent = stats.kombins;
            if (index === 1) num.textContent = stats.faces;
            if (index === 2) num.textContent = stats.users;
            if (index === 3) num.textContent = stats.pending;
        }
    });

    // Update recent uploads from database
    renderRecentUploads();
    renderActivityChart();
    renderPeriodStats();
}

// Render dynamic activity chart for last 7 days
function renderActivityChart() {
    const chart = document.getElementById('activityChart');
    if (!chart) return;

    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday

    // Calculate activity for each day of last 7 days
    const activityData = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Count content created on this day
        const count = StarlitDB.content.filter(c => c.createdAt === dateStr).length;
        activityData.push(count);
    }

    const maxCount = Math.max(...activityData, 1);

    chart.innerHTML = activityData.map((count, index) => {
        const dayIndex = (dayOfWeek - 6 + index + 7) % 7;
        const height = (count / maxCount) * 100;
        return `
            <div class="bar" style="height: ${Math.max(height, 10)}%">
                <span class="bar-value">${count}</span>
                <span>${days[dayIndex === 0 ? 6 : dayIndex - 1]}</span>
            </div>
        `;
    }).join('');
}

// Render period stats (last week, last month)
function renderPeriodStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Last week stats
    const weekContent = StarlitDB.content.filter(c => new Date(c.createdAt) >= oneWeekAgo).length;
    const weekUsers = StarlitDB.users.filter(u => new Date(u.createdAt) >= oneWeekAgo).length;
    const weekViews = StarlitDB.content.filter(c => new Date(c.createdAt) >= oneWeekAgo)
        .reduce((sum, c) => sum + (c.views || 0), 0);

    // Last month stats
    const monthContent = StarlitDB.content.filter(c => new Date(c.createdAt) >= oneMonthAgo).length;
    const monthUsers = StarlitDB.users.filter(u => new Date(u.createdAt) >= oneMonthAgo).length;
    const monthViews = StarlitDB.content.filter(c => new Date(c.createdAt) >= oneMonthAgo)
        .reduce((sum, c) => sum + (c.views || 0), 0);

    // Update DOM
    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('lastWeekContent', weekContent);
    el('lastWeekUsers', weekUsers);
    el('lastWeekViews', weekViews);
    el('lastMonthContent', monthContent);
    el('lastMonthUsers', monthUsers);
    el('lastMonthViews', monthViews);
}

function renderRecentUploads() {
    const container = document.querySelector('.recent-items');
    if (!container) return;

    const recent = [...StarlitDB.content]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    container.innerHTML = recent.map(item => {
        const creator = StarlitDB.getUser(item.creatorId);
        const statusClass = item.status === 'approved' ? 'approved' : item.status === 'pending' ? 'pending' : 'rejected';
        const statusText = item.status === 'approved' ? 'Onaylandı' : item.status === 'pending' ? 'Bekliyor' : 'Reddedildi';
        return `
            <div class="recent-item">
                <img src="${item.image}" alt="">
                <div class="recent-info">
                    <span class="recent-title">${item.title}</span>
                    <span class="recent-meta">${creator?.username || 'Bilinmeyen'} • ${item.createdAt}</span>
                </div>
                <span class="recent-status ${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
}

// Moderation
function initModeration() {
    renderPendingContent();

    document.querySelectorAll('.mod-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterModeration(tab.dataset.filter);
        });
    });
}

function renderPendingContent() {
    const list = document.getElementById('moderationList');
    const pending = StarlitDB.getPending();

    if (list && pending.length > 0) {
        list.innerHTML = pending.map(item => `
            <div class="moderation-item" data-id="${item.id}" data-type="${item.type}">
                <img src="${item.image}" alt="${item.title}" class="mod-thumbnail">
                <div class="mod-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="mod-meta">
                        <span><i class="fas fa-user"></i> ${StarlitDB.getUser(item.creatorId)?.username || 'Bilinmeyen'}</span>
                        <span><i class="fas fa-clock"></i> ${item.createdAt}</span>
                    </div>
                </div>
                <div class="mod-actions">
                    <button class="mod-btn approve" onclick="approveItem(${item.id})"><i class="fas fa-check"></i></button>
                    <button class="mod-btn reject" onclick="rejectItem(${item.id})"><i class="fas fa-times"></i></button>
                    <button class="mod-btn preview" onclick="previewItem(${item.id})"><i class="fas fa-eye"></i></button>
                </div>
            </div>
        `).join('');
    } else if (list) {
        list.innerHTML = '<p class="no-content">Bekleyen içerik yok.</p>';
    }

    updatePendingCount();
}

function filterModeration(filter) {
    document.querySelectorAll('.moderation-item').forEach(item => {
        if (filter === 'all') {
            item.style.display = 'flex';
        } else if (filter === 'kombins' && item.dataset.type === 'kombin') {
            item.style.display = 'flex';
        } else if (filter === 'faces' && item.dataset.type === 'yuz') {
            item.style.display = 'flex';
        } else if (filter === 'animations' && item.dataset.type === 'animation') {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

window.approveItem = function (id) {
    if (StarlitDB.approveContent(id)) {
        const item = document.querySelector(`.moderation-item[data-id="${id}"]`);
        if (item) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(50px)';
            setTimeout(() => {
                item.remove();
                updatePendingCount();
                initDashboard(); // Refresh dashboard
                showToast('İçerik onaylandı ve yayınlandı!');
            }, 300);
        }
    }
};

window.rejectItem = function (id) {
    if (StarlitDB.rejectContent(id)) {
        const item = document.querySelector(`.moderation-item[data-id="${id}"]`);
        if (item) {
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                updatePendingCount();
                initDashboard();
                showToast('İçerik reddedildi.');
            }, 300);
        }
    }
};

window.previewItem = function (id) {
    const content = StarlitDB.content.find(c => c.id === id);
    if (content) {
        window.open(content.image, '_blank');
    }
};

function updatePendingCount() {
    const pending = StarlitDB.getPending();
    const count = pending.length;
    const badge = document.getElementById('pendingCount');
    if (badge) badge.textContent = count;

    // Update moderation tab counts
    const kombinCount = pending.filter(p => p.type === 'kombin').length;
    const faceCount = pending.filter(p => p.type === 'yuz').length;
    const animCount = pending.filter(p => p.type === 'animation').length;

    const modAllCount = document.getElementById('modAllCount');
    const modKombinCount = document.getElementById('modKombinCount');
    const modFaceCount = document.getElementById('modFaceCount');
    const modAnimCount = document.getElementById('modAnimCount');

    if (modAllCount) modAllCount.textContent = count;
    if (modKombinCount) modKombinCount.textContent = kombinCount;
    if (modFaceCount) modFaceCount.textContent = faceCount;
    if (modAnimCount) modAnimCount.textContent = animCount;
}

// Reports
function initReports() {
    renderReports();
}

function renderReports() {
    const list = document.querySelector('.reports-list');
    const reports = StarlitDB.getReports('pending');

    if (list && reports.length > 0) {
        list.innerHTML = reports.map(report => {
            const content = StarlitDB.content.find(c => c.id === report.contentId);
            const reporter = StarlitDB.getUser(report.reporterId);
            return `
                <div class="report-item" data-id="${report.id}">
                    <div class="report-icon warning"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="report-info">
                        <h4>${content?.title || 'İçerik bulunamadı'}</h4>
                        <p>${report.reason}</p>
                        <div class="report-meta">
                            <span><i class="fas fa-user"></i> Raporlayan: ${reporter?.username || 'Bilinmeyen'}</span>
                            <span><i class="fas fa-clock"></i> ${report.createdAt}</span>
                        </div>
                    </div>
                    <div class="report-actions">
                        <button class="mod-btn approve" onclick="resolveReport(${report.id}, 'resolved')"><i class="fas fa-check"></i> Çöz</button>
                        <button class="mod-btn reject" onclick="resolveReport(${report.id}, 'dismissed')"><i class="fas fa-times"></i> Reddet</button>
                    </div>
                </div>
            `;
        }).join('');
    } else if (list) {
        list.innerHTML = '<p class="no-content">Bekleyen rapor yok.</p>';
    }
}

window.resolveReport = function (id, action) {
    if (StarlitDB.resolveReport(id, action)) {
        const item = document.querySelector(`.report-item[data-id="${id}"]`);
        if (item) {
            item.style.opacity = '0';
            setTimeout(() => item.remove(), 300);
            showToast(action === 'resolved' ? 'Rapor çözüldü.' : 'Rapor reddedildi.');
        }
    }
};

// Notifications for admin panel
function initNotifications() {
    const adminNotifBtn = document.querySelector('.admin-header .notification-btn');
    const notifDropdown = document.getElementById('adminNotifDropdown');

    // Create dropdown if it doesn't exist
    if (adminNotifBtn && !notifDropdown) {
        const dropdown = document.createElement('div');
        dropdown.id = 'adminNotifDropdown';
        dropdown.className = 'notification-dropdown';
        dropdown.innerHTML = `
            <div class="notif-header">
                <h4>Admin Bildirimleri</h4>
            </div>
            <div class="notif-list" id="adminNotifList"></div>
        `;
        adminNotifBtn.parentElement.appendChild(dropdown);

        adminNotifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
            renderAdminNotifications();
        });

        document.addEventListener('click', () => dropdown.classList.remove('active'));
    }

    // Update badge
    const pending = StarlitDB.getPending().length;
    const reports = StarlitDB.getReports('pending').length;
    const badge = adminNotifBtn?.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = pending + reports;
    }
}

function renderAdminNotifications() {
    const list = document.getElementById('adminNotifList');
    if (!list) return;

    const pending = StarlitDB.getPending();
    const reports = StarlitDB.getReports('pending');

    let html = '';

    pending.forEach(p => {
        html += `<div class="notif-item unread" onclick="goToSection('moderation')">
            <div class="notif-icon approve"><i class="fas fa-clock"></i></div>
            <div class="notif-content">
                <p><strong>${p.title}</strong> onay bekliyor</p>
                <span class="notif-time">${p.createdAt}</span>
            </div>
        </div>`;
    });

    reports.forEach(r => {
        html += `<div class="notif-item unread" onclick="goToSection('reports')">
            <div class="notif-icon warning"><i class="fas fa-flag"></i></div>
            <div class="notif-content">
                <p><strong>Rapor:</strong> ${r.reason}</p>
                <span class="notif-time">${r.createdAt}</span>
            </div>
        </div>`;
    });

    if (html === '') {
        html = '<p class="no-content" style="padding: 20px; text-align: center;">Yeni bildirim yok</p>';
    }

    list.innerHTML = html;
}

// Users
function initUsers() {
    renderUsersTable();

    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal');
    const closeUserModal = document.getElementById('closeUserModal');
    const addUserForm = document.getElementById('addUserForm');
    const editUserModal = document.getElementById('editUserModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const editUserForm = document.getElementById('editUserForm');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    addUserBtn?.addEventListener('click', () => addUserModal?.classList.add('active'));
    closeUserModal?.addEventListener('click', () => addUserModal?.classList.remove('active'));
    addUserModal?.addEventListener('click', (e) => {
        if (e.target === addUserModal) addUserModal.classList.remove('active');
    });

    addUserForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const role = document.getElementById('newRole').value;

        const newUser = {
            id: StarlitDB.users.length + 1,
            username,
            email,
            password: '123456',
            role,
            avatar: username.substring(0, 2).toUpperCase(),
            avatarUrl: null,
            createdAt: new Date().toISOString().split('T')[0]
        };
        StarlitDB.users.push(newUser);
        StarlitDB.save();

        renderUsersTable();
        initDashboard();
        addUserModal.classList.remove('active');
        addUserForm.reset();
        showToast('Kullanıcı eklendi!');
    });

    closeEditModal?.addEventListener('click', () => editUserModal?.classList.remove('active'));
    editUserForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentEditRow) {
            const username = document.getElementById('editUsername').value;
            const email = document.getElementById('editEmail').value;
            const role = document.getElementById('editRole').value;

            const user = StarlitDB.users.find(u => u.username === currentEditRow.cells[0].querySelector('span').textContent);
            if (user) {
                user.username = username;
                user.email = email;
                user.role = role;
                user.avatar = username.substring(0, 2).toUpperCase();
                StarlitDB.save();
            }

            renderUsersTable();
            editUserModal.classList.remove('active');
            showToast('Kullanıcı güncellendi!');
        }
    });

    cancelDelete?.addEventListener('click', () => deleteConfirmModal?.classList.remove('active'));
    confirmDelete?.addEventListener('click', () => {
        if (deleteRow) {
            const username = deleteRow.cells[0].querySelector('span').textContent;
            const index = StarlitDB.users.findIndex(u => u.username === username);
            if (index > -1) {
                StarlitDB.users.splice(index, 1);
                StarlitDB.save();
            }
            renderUsersTable();
            initDashboard();
            deleteConfirmModal?.classList.remove('active');
            showToast('Kullanıcı silindi.');
        }
    });
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = StarlitDB.users.map(user => {
        const roleClass = user.role === 'admin' ? 'admin' : user.role === 'moderator' ? 'moderator' : 'user';
        const roleText = user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderatör' : 'Kullanıcı';
        return `
            <tr>
                <td><div class="user-cell"><div class="user-avatar">${user.avatar}</div><span>${user.username}</span></div></td>
                <td>${user.email}</td>
                <td><span class="role-badge ${roleClass}">${roleText}</span></td>
                <td>${user.createdAt}</td>
                <td><span class="status-badge active">Aktif</span></td>
                <td><button class="table-btn edit" onclick="editUser(this)"><i class="fas fa-edit"></i></button><button class="table-btn delete" onclick="deleteUser(this)"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
    }).join('');
}

window.editUser = function (btn) {
    currentEditRow = btn.closest('tr');
    const username = currentEditRow.cells[0].querySelector('span').textContent;
    const email = currentEditRow.cells[1].textContent;
    const roleSpan = currentEditRow.cells[2].querySelector('.role-badge');

    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = roleSpan.classList.contains('admin') ? 'admin' :
        roleSpan.classList.contains('moderator') ? 'moderator' : 'user';

    document.getElementById('editUserModal')?.classList.add('active');
};

window.deleteUser = function (btn) {
    deleteRow = btn.closest('tr');
    document.getElementById('deleteConfirmModal')?.classList.add('active');
};

// Content
let currentContentType = 'kombinler';
let currentContentStatus = 'all';

function initContent() {
    updateContentCounts();

    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentContentType = tab.dataset.type;
            loadContentFiltered();
        });
    });

    // Status filter dropdown
    const statusFilter = document.querySelector('.content-filter');
    statusFilter?.addEventListener('change', (e) => {
        currentContentStatus = e.target.value;
        loadContentFiltered();
    });

    loadContentFiltered();

    // Content search
    const contentSearch = document.querySelector('.content-search');
    contentSearch?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.content-card').forEach(card => {
            const title = card.querySelector('.content-title')?.textContent.toLowerCase() || '';
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    });
}

function updateContentCounts() {
    const kombinlerCount = document.getElementById('kombinlerCount');
    const yuzlerCount = document.getElementById('yuzlerCount');
    const animasyonlarCount = document.getElementById('animasyonlarCount');

    if (kombinlerCount) kombinlerCount.textContent = StarlitDB.getContent('kombin', 'approved').length;
    if (yuzlerCount) yuzlerCount.textContent = StarlitDB.getContent('yuz', 'approved').length;
    if (animasyonlarCount) animasyonlarCount.textContent = StarlitDB.topics?.length || 0;
}

function loadContentFiltered() {
    const grid = document.getElementById('contentGrid');
    const dbType = currentContentType === 'kombinler' ? 'kombin' : currentContentType === 'yuzler' ? 'yuz' : 'kombin';

    // Get items based on status filter
    let items;
    if (currentContentStatus === 'all') {
        items = StarlitDB.content.filter(c => c.type === dbType);
    } else {
        items = StarlitDB.getContent(dbType, currentContentStatus);
    }

    if (grid) {
        if (items.length === 0) {
            grid.innerHTML = '<p class="no-content">Bu kategoride içerik yok.</p>';
            return;
        }

        grid.innerHTML = items.map(item => {
            const statusClass = item.status === 'approved' ? 'approved' : item.status === 'pending' ? 'pending' : 'rejected';
            const statusText = item.status === 'approved' ? 'Onaylanmış' : item.status === 'pending' ? 'Beklemede' : 'Reddedilmiş';
            const pinClass = item.pinned ? 'pinned' : '';

            return `
            <div class="content-card ${pinClass}" data-id="${item.id}">
                <div class="content-card-image">
                    <img src="${item.image}" alt="${item.title}">
                    ${item.pinned ? '<span class="pin-badge"><i class="fas fa-thumbtack"></i></span>' : ''}
                </div>
                <div class="content-card-info">
                    <span class="content-title">${item.title}</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="content-card-actions">
                    <button class="table-btn ${item.pinned ? 'active' : ''}" onclick="togglePin(${item.id})" title="Sabitle"><i class="fas fa-thumbtack"></i></button>
                    <button class="table-btn edit" onclick="editContent(${item.id})" title="Düzenle"><i class="fas fa-edit"></i></button>
                    <button class="table-btn delete" onclick="trashContent(${item.id})" title="Çöp Kutusu"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `}).join('');
    }
}

// Keep old loadContent for backwards compatibility
function loadContent(type) {
    currentContentType = type;
    loadContentFiltered();
}

window.togglePin = function (id) {
    const item = StarlitDB.content.find(c => c.id === id);
    if (item) {
        item.pinned = !item.pinned;
        StarlitDB.save();
        loadContentFiltered();
        showToast(item.pinned ? 'İçerik sabitlendi!' : 'Sabitleme kaldırıldı!');
    }
};

window.editContent = function (id) {
    const item = StarlitDB.content.find(c => c.id === id);
    if (!item) return;

    // Create edit modal if it doesn't exist
    let modal = document.getElementById('editContentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editContentModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="document.getElementById('editContentModal').classList.remove('active')"><i class="fas fa-times"></i></button>
                <h2><i class="fas fa-edit"></i> İçerik Düzenle</h2>
                <form id="editContentForm">
                    <input type="hidden" id="editContentId">
                    <div class="form-group">
                        <label>Başlık</label>
                        <input type="text" id="editContentTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Açıklama</label>
                        <textarea id="editContentDesc" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Durum</label>
                        <select id="editContentStatus">
                            <option value="approved">Onaylanmış</option>
                            <option value="pending">Beklemede</option>
                            <option value="rejected">Reddedilmiş</option>
                        </select>
                    </div>
                    <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Kaydet</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('editContentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = parseInt(document.getElementById('editContentId').value);
            const editItem = StarlitDB.content.find(c => c.id === editId);
            if (editItem) {
                editItem.title = document.getElementById('editContentTitle').value;
                editItem.description = document.getElementById('editContentDesc').value;
                editItem.status = document.getElementById('editContentStatus').value;
                StarlitDB.save();
                loadContentFiltered();
                updateContentCounts();
                modal.classList.remove('active');
                showToast('İçerik güncellendi!');
            }
        });
    }

    document.getElementById('editContentId').value = item.id;
    document.getElementById('editContentTitle').value = item.title;
    document.getElementById('editContentDesc').value = item.description || '';
    document.getElementById('editContentStatus').value = item.status;
    modal.classList.add('active');
};

window.deleteContent = function (id) {
    if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
        const index = StarlitDB.content.findIndex(c => c.id === id);
        if (index > -1) {
            StarlitDB.content.splice(index, 1);
            StarlitDB.save();
        }
        const card = document.querySelector(`.content-card[data-id="${id}"]`);
        if (card) {
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                initDashboard();
                updateContentCounts();
            }, 300);
            showToast('İçerik silindi.');
        }
    }
};

window.trashContent = function (id) {
    if (confirm('Bu içeriği çöp kutusuna göndermek istediğinizden emin misiniz?')) {
        const item = StarlitDB.content.find(c => c.id === id);
        if (item) {
            item.status = 'rejected';
            StarlitDB.save();
        }
        const card = document.querySelector(`.content-card[data-id="${id}"]`);
        if (card) {
            card.style.opacity = '0';
            setTimeout(() => {
                loadContentFiltered();
                initDashboard();
                updateContentCounts();
            }, 300);
            showToast('İçerik çöp kutusuna taşındı.');
        }
    }
};

// Settings
function initSettings() {
    const saveBtn = document.querySelector('.save-settings-btn');
    saveBtn?.addEventListener('click', saveSettings);
}

function initThemeSettings() {
    const primaryColorInput = document.querySelectorAll('input[type="color"]')[0];
    const secondaryColorInput = document.querySelectorAll('input[type="color"]')[1];

    // Set current values
    if (primaryColorInput) primaryColorInput.value = StarlitDB.settings.primaryColor;
    if (secondaryColorInput) secondaryColorInput.value = StarlitDB.settings.secondaryColor;

    primaryColorInput?.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--accent-purple', e.target.value);
    });

    secondaryColorInput?.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--accent-pink', e.target.value);
    });
}

function loadSettings() {
    if (StarlitDB?.settings) {
        const s = StarlitDB.settings;
        if (s.siteName) document.getElementById('siteName').value = s.siteName;
        if (s.siteDescription) document.getElementById('siteDescription').value = s.siteDescription;
        if (s.discordInviteUrl) document.getElementById('discordInviteUrl').value = s.discordInviteUrl;
        if (s.maintenanceMode) document.getElementById('maintenanceMode').checked = s.maintenanceMode;
        if (s.maintenanceEstimate) document.getElementById('maintenanceEstimate').value = s.maintenanceEstimate;

        // Load banned words
        const bannedWordsField = document.querySelector('textarea[placeholder*="yasaklı"]');
        if (bannedWordsField && s.bannedWords) {
            bannedWordsField.value = s.bannedWords.join('\n');
        }
    }

    // Load moderator permissions
    if (StarlitDB?.moderatorPermissions) {
        const p = StarlitDB.moderatorPermissions;
        const modApprove = document.getElementById('modCanApprove');
        const modDelete = document.getElementById('modCanDelete');
        const modLock = document.getElementById('modCanLock');
        const modBan = document.getElementById('modCanBan');
        const modEdit = document.getElementById('modCanEditUsers');

        if (modApprove) modApprove.checked = p.canApproveContent;
        if (modDelete) modDelete.checked = p.canDeleteContent;
        if (modLock) modLock.checked = p.canLockTopics;
        if (modBan) modBan.checked = p.canBanUsers;
        if (modEdit) modEdit.checked = p.canEditUsers;
    }
}

function saveSettings() {
    const primaryColorInput = document.querySelectorAll('input[type="color"]')[0];
    const secondaryColorInput = document.querySelectorAll('input[type="color"]')[1];
    const bannedWordsField = document.querySelector('textarea[placeholder*="yasaklı"]');

    StarlitDB.settings = {
        siteName: document.getElementById('siteName')?.value || 'Starlit',
        siteDescription: document.getElementById('siteDescription')?.value || '',
        discordInviteUrl: document.getElementById('discordInviteUrl')?.value || '',
        discordWebhook: document.getElementById('discordWebhook')?.value || '',
        primaryColor: primaryColorInput?.value || '#8b5cf6',
        secondaryColor: secondaryColorInput?.value || '#ec4899',
        maintenanceMode: document.getElementById('maintenanceMode')?.checked || false,
        maintenanceEstimate: document.getElementById('maintenanceEstimate')?.value || '30 Dakika',
        notifyUploads: document.getElementById('notifyUploads')?.checked || true,
        bannedWords: bannedWordsField?.value.split('\n').filter(w => w.trim()) || []
    };

    StarlitDB.moderatorPermissions = {
        canApproveContent: document.getElementById('modCanApprove')?.checked || false,
        canDeleteContent: document.getElementById('modCanDelete')?.checked || false,
        canLockTopics: document.getElementById('modCanLock')?.checked || false,
        canBanUsers: document.getElementById('modCanBan')?.checked || false,
        canEditUsers: document.getElementById('modCanEditUsers')?.checked || false
    };

    StarlitDB.save();
    StarlitDB.applyThemeColors();
    showToast('Ayarlar kaydedildi!');
}

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}
