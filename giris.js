// STARLIT - GİRİŞ JS
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Load platform stats from database
    loadPlatformStats();

    // Load best of week from database
    loadBestOfWeek();

    // Load Discord link from settings
    loadDiscordLink();

    // Demo users (also check database for registered users)
    const defaultUsers = [
        { username: 'ByFatih', password: '123456', role: 'admin' },
        { username: 'xRiot', password: '123456', role: 'moderator' },
        { username: 'user', password: 'user', role: 'user' }
    ];

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('rememberMe').checked;

        // Check default users first
        let user = defaultUsers.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

        // Also check database users
        if (!user && typeof StarlitDB !== 'undefined') {
            const dbUser = StarlitDB.users.find(u =>
                u.username.toLowerCase() === username.toLowerCase() && u.password === password
            );
            if (dbUser) {
                user = { username: dbUser.username, role: dbUser.role };
            }
        }

        if (user) {
            const userData = {
                username: user.username,
                role: user.role,
                loggedIn: true
            };

            // Check if maintenance mode is on and user is not admin/moderator
            if (typeof StarlitDB !== 'undefined' && StarlitDB.settings?.maintenanceMode) {
                if (user.role !== 'admin' && user.role !== 'moderator') {
                    window.location.href = 'bakim.html';
                    return;
                }
            }

            if (remember) {
                localStorage.setItem('starlitUser', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('starlitUser', JSON.stringify(userData));
            }
            window.location.href = 'index.html';
        } else {
            showError('Kullanıcı adı veya şifre hatalı!');
        }
    });
});

function loadPlatformStats() {
    if (typeof StarlitDB === 'undefined') return;

    // Get approved content
    const kombins = StarlitDB.getContent('kombin', 'approved');
    const faces = StarlitDB.getContent('yuz', 'approved');
    const allContent = [...kombins, ...faces];

    // Calculate stats
    const totalKombins = kombins.length;
    const totalLikes = allContent.reduce((sum, item) => sum + (item.likes || 0), 0);
    const totalViews = allContent.reduce((sum, item) => sum + (item.views || 0), 0);

    // Update DOM
    const statKombins = document.getElementById('statKombins');
    const statLikes = document.getElementById('statLikes');
    const statViews = document.getElementById('statViews');

    if (statKombins) statKombins.textContent = totalKombins + '+';
    if (statLikes) statLikes.textContent = totalLikes.toLocaleString();
    if (statViews) statViews.textContent = totalViews.toLocaleString();
}

function loadBestOfWeek() {
    if (typeof StarlitDB === 'undefined') return;

    // Get approved kombins from last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyKombins = StarlitDB.getContent('kombin', 'approved').filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= oneWeekAgo;
    });

    // Find the one with most likes
    let bestItem = weeklyKombins.sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];

    // If no weekly content, get the most liked overall
    if (!bestItem) {
        bestItem = StarlitDB.getContent('kombin', 'approved')
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
    }

    if (!bestItem) return;

    // Get creator info
    const creator = StarlitDB.getUser(bestItem.creatorId);

    // Update DOM
    const bestWeekImage = document.getElementById('bestWeekImage');
    const bestWeekTitle = document.getElementById('bestWeekTitle');
    const bestWeekAvatar = document.getElementById('bestWeekAvatar');
    const bestWeekCreator = document.getElementById('bestWeekCreator');
    const bestWeekLikes = document.getElementById('bestWeekLikes');
    const bestWeekComments = document.getElementById('bestWeekComments');
    const bestWeekViews = document.getElementById('bestWeekViews');

    if (bestWeekImage) bestWeekImage.src = bestItem.image;
    if (bestWeekTitle) bestWeekTitle.textContent = `"${bestItem.title}"`;
    if (bestWeekAvatar) bestWeekAvatar.textContent = creator?.avatar || bestItem.title.substring(0, 2).toUpperCase();
    if (bestWeekCreator) bestWeekCreator.textContent = creator?.username || 'Bilinmeyen';
    if (bestWeekLikes) bestWeekLikes.textContent = bestItem.likes || 0;
    if (bestWeekComments) bestWeekComments.textContent = bestItem.comments?.length || 0;
    if (bestWeekViews) bestWeekViews.textContent = bestItem.views || 0;
}

function loadDiscordLink() {
    if (typeof StarlitDB === 'undefined') return;

    const discordUrl = StarlitDB.settings?.discordInviteUrl;
    if (discordUrl) {
        const discordBtn = document.getElementById('discordBtn');
        if (discordBtn) {
            discordBtn.href = discordUrl;
            discordBtn.target = '_blank';
        }
    }
}

function showError(message) {
    let errorEl = document.querySelector('.login-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'login-error';
        document.getElementById('loginForm').prepend(errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 3000);
}
