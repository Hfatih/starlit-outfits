// Firebase Configuration
// KULLANICI: Bu değerleri kendi Firebase projenizden alın
// Firebase Console → Project Settings → Your apps → Web app → Firebase SDK snippet

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// ==========================================
// STARLIT DATABASE - FIREBASE VERSION
// ==========================================

const StarlitDB = {
    // Cache for faster reads
    _cache: {
        users: [],
        content: [],
        settings: null,
        lastFetch: null
    },

    // Default settings
    defaultSettings: {
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

    // Initialize
    init: async function () {
        try {
            await this.loadSettings();
            await this.loadUsers();
            await this.loadContent();
            this.checkMaintenanceMode();
            this.applyThemeColors();
            console.log('✅ StarlitDB Firebase initialized');
        } catch (error) {
            console.error('❌ Firebase init error:', error);
            // Fallback to localStorage if Firebase fails
            this.initLocalStorage();
        }
    },

    // Fallback to localStorage
    initLocalStorage: function () {
        const saved = localStorage.getItem('starlitDatabase');
        if (saved) {
            const data = JSON.parse(saved);
            this._cache.users = data.users || [];
            this._cache.content = data.content || [];
            this._cache.settings = data.settings || this.defaultSettings;
        }
    },

    // ==========================================
    // SETTINGS
    // ==========================================

    get settings() {
        return this._cache.settings || this.defaultSettings;
    },

    loadSettings: async function () {
        try {
            const doc = await db.collection('settings').doc('main').get();
            if (doc.exists) {
                this._cache.settings = { ...this.defaultSettings, ...doc.data() };
            } else {
                // Create default settings
                await db.collection('settings').doc('main').set(this.defaultSettings);
                this._cache.settings = this.defaultSettings;
            }
        } catch (error) {
            console.error('Settings load error:', error);
            this._cache.settings = this.defaultSettings;
        }
    },

    saveSettings: async function (newSettings) {
        try {
            await db.collection('settings').doc('main').set(newSettings, { merge: true });
            this._cache.settings = { ...this._cache.settings, ...newSettings };
            return true;
        } catch (error) {
            console.error('Settings save error:', error);
            return false;
        }
    },

    // ==========================================
    // USERS
    // ==========================================

    get users() {
        return this._cache.users;
    },

    loadUsers: async function () {
        try {
            const snapshot = await db.collection('users').get();
            this._cache.users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Users load error:', error);
        }
    },

    getUser: function (id) {
        return this._cache.users.find(u => u.id === id || u.id === String(id));
    },

    getUserByUsername: function (username) {
        return this._cache.users.find(u => u.username?.toLowerCase() === username?.toLowerCase());
    },

    getCurrentUser: function () {
        const session = JSON.parse(sessionStorage.getItem('starlitUser') || localStorage.getItem('starlitUser') || 'null');
        if (session && session.loggedIn) {
            return this.getUserByUsername(session.username);
        }
        return null;
    },

    isAdmin: function () {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    isModerator: function () {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'moderator');
    },

    addUser: async function (userData) {
        try {
            const docRef = await db.collection('users').add({
                ...userData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            const newUser = { id: docRef.id, ...userData };
            this._cache.users.push(newUser);
            return newUser;
        } catch (error) {
            console.error('Add user error:', error);
            return null;
        }
    },

    updateUser: async function (userId, updates) {
        try {
            await db.collection('users').doc(userId).update(updates);
            const index = this._cache.users.findIndex(u => u.id === userId);
            if (index !== -1) {
                this._cache.users[index] = { ...this._cache.users[index], ...updates };
            }
            return true;
        } catch (error) {
            console.error('Update user error:', error);
            return false;
        }
    },

    // ==========================================
    // CONTENT (Kombins & Faces)
    // ==========================================

    get content() {
        return this._cache.content;
    },

    loadContent: async function () {
        try {
            const snapshot = await db.collection('content').orderBy('createdAt', 'desc').get();
            this._cache.content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Content load error:', error);
        }
    },

    getContent: function (type = 'all', status = 'approved') {
        return this._cache.content.filter(c =>
            (type === 'all' || c.type === type) &&
            (status === 'all' || c.status === status)
        );
    },

    getTopLiked: function (limit = 10) {
        return this._cache.content
            .filter(c => c.status === 'approved')
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, limit);
    },

    addContent: async function (contentData) {
        try {
            const docRef = await db.collection('content').add({
                ...contentData,
                likes: 0,
                views: 0,
                comments: 0,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            const newContent = { id: docRef.id, ...contentData, likes: 0, views: 0, comments: 0, status: 'pending' };
            this._cache.content.unshift(newContent);
            return newContent;
        } catch (error) {
            console.error('Add content error:', error);
            return null;
        }
    },

    updateContent: async function (contentId, updates) {
        try {
            await db.collection('content').doc(contentId).update(updates);
            const index = this._cache.content.findIndex(c => c.id === contentId);
            if (index !== -1) {
                this._cache.content[index] = { ...this._cache.content[index], ...updates };
            }
            return true;
        } catch (error) {
            console.error('Update content error:', error);
            return false;
        }
    },

    deleteContent: async function (contentId) {
        try {
            await db.collection('content').doc(contentId).delete();
            this._cache.content = this._cache.content.filter(c => c.id !== contentId);
            return true;
        } catch (error) {
            console.error('Delete content error:', error);
            return false;
        }
    },

    likeContent: async function (contentId) {
        const content = this._cache.content.find(c => c.id === contentId);
        if (content) {
            const newLikes = (content.likes || 0) + 1;
            await this.updateContent(contentId, { likes: newLikes });
        }
    },

    viewContent: async function (contentId) {
        const content = this._cache.content.find(c => c.id === contentId);
        if (content) {
            const newViews = (content.views || 0) + 1;
            await this.updateContent(contentId, { views: newViews });
        }
    },

    approveContent: async function (contentId) {
        return await this.updateContent(contentId, { status: 'approved' });
    },

    rejectContent: async function (contentId) {
        return await this.updateContent(contentId, { status: 'rejected' });
    },

    // ==========================================
    // MAINTENANCE MODE
    // ==========================================

    checkMaintenanceMode: function () {
        if (this.settings.maintenanceMode) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (currentPage !== 'admin.html' && currentPage !== 'giris.html' && currentPage !== 'bakim.html') {
                const user = this.getCurrentUser();
                if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
                    window.location.href = 'bakim.html';
                }
            }
        }
    },

    // ==========================================
    // THEME
    // ==========================================

    applyThemeColors: function () {
        const primary = this.settings.primaryColor || '#8b5cf6';
        const secondary = this.settings.secondaryColor || '#ec4899';

        document.documentElement.style.setProperty('--accent-purple', primary);
        document.documentElement.style.setProperty('--accent-pink', secondary);
        document.documentElement.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    StarlitDB.init();
});

// Logout function
function logout() {
    localStorage.removeItem('starlitUser');
    sessionStorage.removeItem('starlitUser');
    window.location.href = 'giris.html';
}
