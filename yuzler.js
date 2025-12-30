// ========================================
// RINA OUTFITS - YÜZLER PAGE JS
// ========================================

// Sample Faces Data
const facesData = [
    {
        id: 1,
        title: "Doğal Güzellik",
        description: "Doğal ve sade bir yüz kodu. Günlük kullanım için ideal.",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "NaturalBeauty", avatar: "NB", date: "24.12.2025" },
        stats: { likes: 10, comments: 3, views: 25, copies: 6 },
        liked: false,
        dateAdded: new Date('2025-12-24')
    },
    {
        id: 2,
        title: "Cool Guy Look",
        description: "Modern erkek yüz kodu. Karakterinize cesur bir görünüm kazandırır.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
        category: "erkek",
        creator: { name: "CoolDude", avatar: "CD", date: "23.12.2025" },
        stats: { likes: 7, comments: 2, views: 18, copies: 4 },
        liked: false,
        dateAdded: new Date('2025-12-23')
    },
    {
        id: 3,
        title: "Elegant Kadın Yüzü",
        description: "Zarif ve sofistike bir kadın yüz kodu.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "ElegantStyle", avatar: "ES", date: "22.12.2025" },
        stats: { likes: 15, comments: 5, views: 40, copies: 10 },
        liked: true,
        dateAdded: new Date('2025-12-22')
    },
    {
        id: 4,
        title: "Bad Boy Vibes",
        description: "Kötü çocuk imajı için harika bir erkek yüz kodu.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        category: "erkek",
        creator: { name: "BadBoyStyle", avatar: "BB", date: "21.12.2025" },
        stats: { likes: 22, comments: 8, views: 55, copies: 12 },
        liked: false,
        dateAdded: new Date('2025-12-21')
    },
    {
        id: 5,
        title: "Masum Bakış",
        description: "Masum ve tatlı bir görünüm için ideal kadın yüzü.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "SweetAngel", avatar: "SA", date: "20.12.2025" },
        stats: { likes: 30, comments: 10, views: 85, copies: 18 },
        liked: true,
        dateAdded: new Date('2025-12-20')
    },
    {
        id: 6,
        title: "Sert Erkek",
        description: "Kaslı ve sert bir erkek yüz kodu.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
        category: "erkek",
        creator: { name: "ToughGuy", avatar: "TG", date: "19.12.2025" },
        stats: { likes: 12, comments: 4, views: 32, copies: 7 },
        liked: false,
        dateAdded: new Date('2025-12-19')
    },
    {
        id: 7,
        title: "Romantik Kadın",
        description: "Romantik ve feminen bir kadın yüzü.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "RomanticSoul", avatar: "RS", date: "18.12.2025" },
        stats: { likes: 25, comments: 7, views: 60, copies: 14 },
        liked: false,
        dateAdded: new Date('2025-12-18')
    },
    {
        id: 8,
        title: "Gizemli Erkek",
        description: "Gizemli ve çekici bir erkek yüzü.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
        category: "erkek",
        creator: { name: "MysteryMan", avatar: "MM", date: "17.12.2025" },
        stats: { likes: 18, comments: 6, views: 45, copies: 9 },
        liked: true,
        dateAdded: new Date('2025-12-17')
    }
];

// State
let filteredFaces = [...facesData];
let currentPage = 1;
let itemsPerPage = 8;
let currentCategory = 'all';
let currentSort = 'date-desc';
let searchQuery = '';
let currentFace = null;

// DOM Elements
const facesGrid = document.getElementById('facesGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const perPageFilter = document.getElementById('perPageFilter');
const cardStyleFilter = document.getElementById('cardStyle');
const totalCount = document.getElementById('totalCount');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const paginationNumbers = document.getElementById('paginationNumbers');

// Modal Elements
const faceModal = document.getElementById('faceModal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalCreatorAvatar = document.getElementById('modalCreatorAvatar');
const modalCreatorName = document.getElementById('modalCreatorName');
const modalCreatorDate = document.getElementById('modalCreatorDate');
const modalDescription = document.getElementById('modalDescription');
const modalFavorites = document.getElementById('modalFavorites');
const modalComments = document.getElementById('modalComments');
const modalViews = document.getElementById('modalViews');
const modalCopies = document.getElementById('modalCopies');
const modalLikeBtn = document.getElementById('modalLikeBtn');
const modalCopyBtn = document.getElementById('modalCopyBtn');
const modalShareBtn = document.getElementById('modalShareBtn');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initModal();
    initPagination();
    filterAndRender();
});

// Filter & Render
function filterAndRender() {
    // Search
    filteredFaces = facesData.filter(face => {
        const matchesSearch = face.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            face.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = currentCategory === 'all' || face.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort
    sortFaces();

    // Reset page if needed
    const totalPages = Math.ceil(filteredFaces.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    renderFaces();
    renderPagination();
}

function sortFaces() {
    switch (currentSort) {
        case 'date-desc':
            filteredFaces.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'date-asc':
            filteredFaces.sort((a, b) => a.dateAdded - b.dateAdded);
            break;
        case 'likes-desc':
            filteredFaces.sort((a, b) => b.stats.likes - a.stats.likes);
            break;
        case 'likes-asc':
            filteredFaces.sort((a, b) => a.stats.likes - b.stats.likes);
            break;
        case 'views-desc':
            filteredFaces.sort((a, b) => b.stats.views - a.stats.views);
            break;
        case 'views-asc':
            filteredFaces.sort((a, b) => a.stats.views - b.stats.views);
            break;
        case 'comments-desc':
            filteredFaces.sort((a, b) => b.stats.comments - a.stats.comments);
            break;
        case 'comments-asc':
            filteredFaces.sort((a, b) => a.stats.comments - b.stats.comments);
            break;
        case 'title-asc':
            filteredFaces.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
            break;
        case 'title-desc':
            filteredFaces.sort((a, b) => b.title.localeCompare(a.title, 'tr'));
            break;
    }
}

function renderFaces() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageFaces = filteredFaces.slice(start, end);

    facesGrid.innerHTML = pageFaces.map((face, index) => `
        <div class="outfit-card" data-id="${face.id}" style="animation-delay: ${index * 0.05}s">
            <div class="card-image">
                <img src="${face.image}" alt="${face.title}" loading="lazy">
                <div class="card-overlay"></div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${face.title}</h3>
                <p class="card-description">${face.description}</p>
                <div class="card-creator">
                    <div class="creator-small-avatar">${face.creator.avatar}</div>
                    <span class="creator-small-name">${face.creator.name}</span>
                </div>
                <div class="card-stats">
                    <span class="card-stat ${face.liked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i> ${face.stats.likes}
                    </span>
                    <span class="card-stat">
                        <i class="fas fa-comment"></i> ${face.stats.comments}
                    </span>
                    <span class="card-stat">
                        <i class="fas fa-eye"></i> ${face.stats.views}
                    </span>
                    <span class="card-date">
                        <i class="fas fa-calendar"></i> ${face.creator.date}
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    totalCount.textContent = filteredFaces.length;

    // Add click listeners
    document.querySelectorAll('.outfit-card').forEach(card => {
        card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
    });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredFaces.length / itemsPerPage);

    currentPageEl.textContent = currentPage;
    totalPagesEl.textContent = totalPages || 1;

    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;

    // Page numbers
    let numbersHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            numbersHtml += `<button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            numbersHtml += '<span class="page-dots">...</span>';
        }
    }
    paginationNumbers.innerHTML = numbersHtml;

    // Add click listeners
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            filterAndRender();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Init Filters
function initFilters() {
    searchInput?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        filterAndRender();
    });

    categoryFilter?.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        currentPage = 1;
        filterAndRender();
    });

    sortFilter?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        currentPage = 1;
        filterAndRender();
    });

    perPageFilter?.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        filterAndRender();
    });

    cardStyleFilter?.addEventListener('change', (e) => {
        if (e.target.value === 'kompakt') {
            facesGrid.classList.add('compact');
        } else {
            facesGrid.classList.remove('compact');
        }
    });
}

// Init Pagination
function initPagination() {
    prevPageBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            filterAndRender();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextPageBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredFaces.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            filterAndRender();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Modal Functions
function initModal() {
    modalClose?.addEventListener('click', closeModal);
    faceModal?.addEventListener('click', (e) => {
        if (e.target === faceModal) closeModal();
    });

    modalLikeBtn?.addEventListener('click', handleLike);
    modalCopyBtn?.addEventListener('click', handleCopy);
    modalShareBtn?.addEventListener('click', handleShare);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(id) {
    currentFace = facesData.find(f => f.id === id);
    if (!currentFace) return;

    // Increment views
    currentFace.stats.views++;

    modalImage.src = currentFace.image;
    modalTitle.textContent = currentFace.title;
    modalCategory.textContent = currentFace.category === 'kadin' ? 'KADIN' : 'ERKEK';
    modalCreatorAvatar.textContent = currentFace.creator.avatar;
    modalCreatorName.textContent = currentFace.creator.name;
    modalCreatorDate.textContent = currentFace.creator.date;
    modalDescription.textContent = currentFace.description;
    modalFavorites.textContent = currentFace.stats.likes;
    modalComments.textContent = currentFace.stats.comments;
    modalViews.textContent = currentFace.stats.views;
    modalCopies.textContent = currentFace.stats.copies;

    updateLikeButton();
    faceModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    faceModal.classList.remove('active');
    document.body.style.overflow = '';
    currentFace = null;
    filterAndRender();
}

function updateLikeButton() {
    if (currentFace.liked) {
        modalLikeBtn.innerHTML = '<i class="fas fa-heart"></i><span>Beğenildi</span>';
        modalLikeBtn.classList.add('liked');
    } else {
        modalLikeBtn.innerHTML = '<i class="far fa-heart"></i><span>Beğen</span>';
        modalLikeBtn.classList.remove('liked');
    }
}

function handleLike() {
    if (!currentFace) return;

    currentFace.liked = !currentFace.liked;
    currentFace.stats.likes += currentFace.liked ? 1 : -1;
    modalFavorites.textContent = currentFace.stats.likes;
    updateLikeButton();
    showToast(currentFace.liked ? 'Beğenildi!' : 'Beğeni kaldırıldı.');
}

function handleCopy() {
    if (!currentFace) return;

    currentFace.stats.copies++;
    modalCopies.textContent = currentFace.stats.copies;

    // Copy face code to clipboard
    const code = `FACE_${currentFace.id}_${currentFace.title.replace(/\s/g, '_').toUpperCase()}`;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Kod panoya kopyalandı!');
    }).catch(() => {
        showToast('Kopyalama başarısız oldu.');
    });
}

function handleShare() {
    if (!currentFace) return;

    const shareData = {
        title: currentFace.title,
        text: currentFace.description,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => { });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link panoya kopyalandı!');
        });
    }
}

// Toast
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
