// STARLIT - ANİMASYONLAR JS (with database integration)
let currentTopicId = 1;
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

document.addEventListener('DOMContentLoaded', () => {
    renderTopicsList(); // Render topics from database first
    initTopics();
    initNewTopic();
    initChat();
    initSort();
    initLockButton();
    initPinButton();
    loadTopic(0); // Load first topic
});

// Render all topics from StarlitDB.topics
function renderTopicsList() {
    const list = document.getElementById('topicsList');
    if (!list || !StarlitDB.topics) return;

    // Sort topics: pinned first, then by id
    const sortedTopics = [...StarlitDB.topics].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return a.id - b.id;
    });

    let html = '';
    let addedDivider = false;

    sortedTopics.forEach((topic, index) => {
        const creator = StarlitDB.getUser(topic.creatorId);
        const messageCount = (StarlitDB.messages[topic.id] || []).length;

        // Add divider after pinned topics
        if (!topic.pinned && !addedDivider && index > 0) {
            html += '<div class="topics-divider">ESKİ PAYLAŞIMLAR</div>';
            addedDivider = true;
        }

        html += `
            <div class="topic-item ${topic.pinned ? 'pinned' : ''} ${index === 0 ? 'active' : ''}" data-id="${topic.id}">
                ${topic.pinned ? '<div class="topic-pin"><i class="fas fa-thumbtack"></i></div>' : ''}
                <div class="topic-info">
                    <h4>${topic.title}</h4>
                    <p><span class="tag-pink">${creator?.username || 'Bilinmeyen'}:</span> ${topic.code}</p>
                    <div class="topic-meta">
                        <span><i class="fas fa-comment"></i> ${messageCount}</span>
                        <button class="topic-share-btn" onclick="shareTopic(event, ${topic.id})"><i class="fas fa-share-alt"></i></button>
                    </div>
                </div>
                ${topic.image ? `<img src="${topic.image}" class="topic-thumb">` : ''}
            </div>
        `;
    });

    list.innerHTML = html;
}

// Topics
function initTopics() {
    document.querySelectorAll('.topic-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.topic-item').forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            loadTopic(parseInt(item.dataset.id));
        });
    });

    document.getElementById('topicSearch')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.topic-item').forEach(item => {
            const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
            item.style.display = title.includes(q) ? 'flex' : 'none';
        });
    });
}

function loadTopic(id) {
    currentTopicId = id;
    const topic = StarlitDB.topics.find(t => t.id === id);
    if (topic) {
        document.getElementById('chatTitle').textContent = topic.title;
        updateLockState(topic.locked);
    }
    renderMessages();
    updateLockButtonUI();
    updatePinButtonUI();
}

function updateLockState(locked) {
    const chatInfo = document.getElementById('chatInfo');
    const chatInput = document.getElementById('chatInput');
    const chatInputArea = document.getElementById('chatInputArea');
    const user = StarlitDB.getCurrentUser();

    if (locked) {
        chatInfo.style.display = 'block';
        if (user && (user.role === 'admin' || user.role === 'moderator')) {
            chatInput.placeholder = 'Bu kanala mesaj gönder...';
            chatInputArea.classList.remove('disabled');
        } else {
            chatInput.placeholder = 'Bu kanal kilitli - mesaj gönderemezsiniz.';
            chatInputArea.classList.add('disabled');
        }
    } else {
        chatInfo.style.display = 'none';
        chatInput.placeholder = 'Bu kanala mesaj gönder...';
        chatInputArea.classList.remove('disabled');
    }
}

function initLockButton() {
    const lockBtn = document.getElementById('lockBtn');
    lockBtn?.addEventListener('click', () => {
        const locked = StarlitDB.toggleTopicLock(currentTopicId);
        if (locked !== null) {
            updateLockState(locked);
            updateLockButtonUI();
            showToast(locked ? 'Konu kilitlendi!' : 'Konu kilidi açıldı!');
        }
    });
}

function updateLockButtonUI() {
    const lockBtn = document.getElementById('lockBtn');
    const user = StarlitDB.getCurrentUser();

    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        lockBtn.style.display = 'none';
    } else {
        lockBtn.style.display = 'flex';
        const topic = StarlitDB.topics.find(t => t.id === currentTopicId);
        if (topic?.locked) {
            lockBtn.innerHTML = '<i class="fas fa-lock"></i>';
            lockBtn.classList.add('locked');
        } else {
            lockBtn.innerHTML = '<i class="fas fa-lock-open"></i>';
            lockBtn.classList.remove('locked');
        }
    }
}

// Pin Button functionality
function initPinButton() {
    const pinBtn = document.getElementById('pinBtn');
    pinBtn?.addEventListener('click', () => {
        const topic = StarlitDB.topics.find(t => t.id === currentTopicId);
        if (topic) {
            topic.pinned = !topic.pinned;
            StarlitDB.save();
            updatePinButtonUI();
            showToast(topic.pinned ? 'Konu başa tutturuldu!' : 'Konu sabitlemesi kaldırıldı!');
            // Re-render topics to reflect pinning change
            renderTopicsList();
        }
    });
}

function updatePinButtonUI() {
    const pinBtn = document.getElementById('pinBtn');
    const user = StarlitDB.getCurrentUser();

    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        pinBtn.style.display = 'none';
    } else {
        pinBtn.style.display = 'flex';
        const topic = StarlitDB.topics.find(t => t.id === currentTopicId);
        if (topic?.pinned) {
            pinBtn.classList.add('pinned');
            pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';
        } else {
            pinBtn.classList.remove('pinned');
            pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';
        }
    }
}

function renderMessages() {
    const container = document.getElementById('chatMessages');
    const messages = StarlitDB.messages[currentTopicId] || [];

    if (messages.length === 0) {
        container.innerHTML = '<div class="no-messages">Henüz mesaj yok. İlk mesajı sen yaz!</div>';
    } else {
        container.innerHTML = messages.map(msg => {
            const user = StarlitDB.getUser(msg.userId);
            const avatarStyle = user?.avatarUrl
                ? `style="background-image: url(${user.avatarUrl}); background-size: cover; background-position: center;"`
                : '';
            const avatarText = user?.avatarUrl ? '' : (user?.avatar || '??');

            return `
        <div class="chat-message">
            <div class="msg-avatar" ${avatarStyle}>${avatarText}</div>
            <div class="msg-content">
                <div class="msg-header">
                    <span class="msg-user">${user?.username || 'Bilinmeyen'}</span>
                    <span class="msg-tag">gg/starlit</span>
                </div>
                <div class="msg-text">${msg.text}</div>
                ${msg.image ? `<img src="${msg.image}" class="msg-image" alt="">` : ''}
                <div class="msg-time">${msg.time}</div>
            </div>
        </div>
    `}).join('');
    }
    container.scrollTop = container.scrollHeight;
}

function shareTopic(event, topicId) {
    event.stopPropagation();
    const url = window.location.origin + window.location.pathname + '?topic=' + topicId;
    navigator.clipboard.writeText(url).then(() => {
        showToast('Konu linki kopyalandı!');
    }).catch(() => {
        showToast('Link kopyalanamadı!');
    });
}

// Sort
function initSort() {
    const sortBtn = document.getElementById('sortDropdownBtn');
    const sortDropdown = document.getElementById('sortDropdown');

    sortBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        sortDropdown?.classList.toggle('active');
    });

    document.addEventListener('click', () => sortDropdown?.classList.remove('active'));

    sortDropdown?.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const sortType = btn.dataset.sort;
            sortTopics(sortType);
            sortDropdown.classList.remove('active');
        });
    });
}

function sortTopics(type) {
    const list = document.getElementById('topicsList');
    const items = Array.from(list.querySelectorAll('.topic-item'));

    items.sort((a, b) => {
        const idA = parseInt(a.dataset.id);
        const idB = parseInt(b.dataset.id);
        const topicA = StarlitDB.topics.find(t => t.id === idA);
        const topicB = StarlitDB.topics.find(t => t.id === idB);

        if (type === 'oldest') return idA - idB;
        if (type === 'newest') return idB - idA;
        if (type === 'comments') {
            const mA = (StarlitDB.messages[idA] || []).length;
            const mB = (StarlitDB.messages[idB] || []).length;
            return mB - mA;
        }
        return 0;
    });

    items.forEach(item => list.appendChild(item));
    showToast('Sıralama güncellendi!');
}

// New Topic
function initNewTopic() {
    const modal = document.getElementById('newTopicModal');
    const openBtn = document.getElementById('newTopicBtn');
    const closeBtn = document.getElementById('closeTopicModal');
    const form = document.getElementById('newTopicForm');
    const imageArea = document.getElementById('topicImageArea');
    const imageInput = document.getElementById('topicImage');
    const preview = document.getElementById('topicImagePreview');
    const previewImg = document.getElementById('topicPreviewImg');
    const removeBtn = document.getElementById('removeTopicImage');

    openBtn?.addEventListener('click', () => modal?.classList.add('active'));
    closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    imageArea?.addEventListener('click', () => imageInput?.click());
    imageInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                previewImg.src = ev.target.result;
                preview.classList.add('active');
                imageArea.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    removeBtn?.addEventListener('click', () => {
        previewImg.src = '';
        preview.classList.remove('active');
        imageArea.style.display = 'block';
        imageInput.value = '';
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('topicTitle').value;
        const code = document.getElementById('topicCode').value;
        const user = StarlitDB.getCurrentUser();

        const newTopic = {
            id: StarlitDB.topics.length,
            title,
            code,
            pinned: false,
            locked: false,
            creatorId: user?.id || 1,
            image: previewImg.src || null // Optional image
        };
        StarlitDB.topics.push(newTopic);
        StarlitDB.messages[newTopic.id] = [];
        StarlitDB.save();

        addTopicToDOM(newTopic);
        modal.classList.remove('active');
        form.reset();
        previewImg.src = '';
        preview.classList.remove('active');
        imageArea.style.display = 'block';
        showToast('Gönderi oluşturuldu!');
    });
}

function addTopicToDOM(topic) {
    const list = document.getElementById('topicsList');
    const creator = StarlitDB.getUser(topic.creatorId);
    const el = document.createElement('div');
    el.className = 'topic-item' + (topic.pinned ? ' pinned' : '');
    el.dataset.id = topic.id;
    el.innerHTML = `
        ${topic.pinned ? '<div class="topic-pin"><i class="fas fa-thumbtack"></i></div>' : ''}
        <div class="topic-info">
            <h4>${topic.title}</h4>
            <p><span class="tag-pink">${creator?.username || 'Bilinmeyen'}:</span> ${topic.code}</p>
            <div class="topic-meta">
                <span><i class="fas fa-comment"></i> ${(StarlitDB.messages[topic.id] || []).length}</span>
                <button class="topic-share-btn" onclick="shareTopic(event, ${topic.id})"><i class="fas fa-share-alt"></i></button>
            </div>
        </div>
        ${topic.image ? `<img src="${topic.image}" class="topic-thumb">` : ''}
    `;
    el.addEventListener('click', () => {
        document.querySelectorAll('.topic-item').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        loadTopic(topic.id);
    });

    // Insert after pinned topics or at beginning
    const firstNonPinned = list.querySelector('.topic-item:not(.pinned)');
    if (topic.pinned || !firstNonPinned) {
        list.insertBefore(el, list.querySelector('.topics-divider') || list.firstChild);
    } else {
        list.appendChild(el);
    }
}

// Chat
function initChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const attachBtn = document.getElementById('attachBtn');
    const imageInput = document.getElementById('chatImageInput');

    attachBtn?.addEventListener('click', () => {
        if (StarlitDB.canUserWrite(currentTopicId)) {
            imageInput?.click();
        } else {
            showToast('Bu kanalda mesaj gönderme yetkiniz yok!');
        }
    });

    imageInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (StarlitDB.addMessage(currentTopicId, '[Görsel]', ev.target.result)) {
                    renderMessages();
                    showToast('Görsel gönderildi!');
                }
                imageInput.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    sendBtn?.addEventListener('click', () => {
        const text = input.value.trim();
        if (text) {
            if (StarlitDB.addMessage(currentTopicId, text)) {
                input.value = '';
                renderMessages();
                showToast('Mesaj gönderildi!');
            } else {
                showToast('Bu kanalda mesaj gönderme yetkiniz yok!');
            }
        }
    });

    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn?.click();
    });
}

function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
