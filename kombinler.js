// ========================================
// RINA OUTFITS - KOMBİNLER PAGE JS
// ========================================

// Sample Outfits Data
const outfitsData = [
    {
        id: 1,
        title: "Soğuk Kış Aylarının Vazgeçilmezi",
        description: "Boğazlı kazak ve kot pantolon ikilisinin sadeliğini ve güzelliğini gösteren kombin.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "xRiot", avatar: "XR", date: "24.12.2025" },
        stats: { likes: 0, comments: 0, views: 4, copies: 0 },
        liked: false,
        dateAdded: new Date('2025-12-24')
    },
    {
        id: 2,
        title: "Gündelik Elegant Stil",
        description: "Şık ve rahat bir günlük kombin.",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "xRiot", avatar: "XR", date: "23.12.2025" },
        stats: { likes: 5, comments: 2, views: 15, copies: 3 },
        liked: false,
        dateAdded: new Date('2025-12-23')
    },
    {
        id: 3,
        title: "Yazlık Plaj Kombini",
        description: "Yaz mevsimi için ideal, hafif ve şık bir kombin.",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "BeachQueen", avatar: "BQ", date: "22.12.2025" },
        stats: { likes: 12, comments: 5, views: 45, copies: 8 },
        liked: true,
        dateAdded: new Date('2025-12-22')
    },
    {
        id: 4,
        title: "Casual Erkek Stili",
        description: "Modern ve rahat erkek kombinasyonu.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        category: "erkek",
        creator: { name: "StreetStyle", avatar: "SS", date: "21.12.2025" },
        stats: { likes: 8, comments: 3, views: 32, copies: 5 },
        liked: false,
        dateAdded: new Date('2025-12-21')
    },
    {
        id: 5,
        title: "Pembe Elbise Kombini",
        description: "Romantik ve feminen bir görünüm için ideal.",
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "PinkLover", avatar: "PL", date: "20.12.2025" },
        stats: { likes: 20, comments: 8, views: 67, copies: 12 },
        liked: true,
        dateAdded: new Date('2025-12-20')
    },
    {
        id: 6,
        title: "Business Casual",
        description: "Ofis için uygun, şık ve profesyonel görünüm.",
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "OfficeLook", avatar: "OL", date: "19.12.2025" },
        stats: { likes: 15, comments: 4, views: 55, copies: 7 },
        liked: false,
        dateAdded: new Date('2025-12-19')
    },
    {
        id: 7,
        title: "Spor Giyim",
        description: "Aktif yaşam için ideal spor kombinasyonu.",
        image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=600&fit=crop",
        category: "erkek",
        creator: { name: "FitStyle", avatar: "FS", date: "18.12.2025" },
        stats: { likes: 6, comments: 1, views: 22, copies: 2 },
        liked: false,
        dateAdded: new Date('2025-12-18')
    },
    {
        id: 8,
        title: "Akşam Elbisesi",
        description: "Özel geceler için zarif bir seçim.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "EveningGlam", avatar: "EG", date: "17.12.2025" },
        stats: { likes: 25, comments: 10, views: 89, copies: 15 },
        liked: true,
        dateAdded: new Date('2025-12-17')
    },
    {
        id: 9,
        title: "Streetwear Look",
        description: "Sokak modasını yansıtan cesur bir kombin.",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop",
        category: "erkek",
        creator: { name: "UrbanKing", avatar: "UK", date: "16.12.2025" },
        stats: { likes: 18, comments: 7, views: 62, copies: 11 },
        liked: false,
        dateAdded: new Date('2025-12-16')
    },
    {
        id: 10,
        title: "Minimalist Chic",
        description: "Az ama öz diyenler için minimalist bir seçim.",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop",
        category: "kadin",
        creator: { name: "LessIsMore", avatar: "LM", date: "15.12.2025" },
        stats: { likes: 30, comments: 12, views: 120, copies: 20 },
        liked: true,
        dateAdded: new Date('2025-12-15')
    }
];

// State
let filteredOutfits = [...outfitsData];
let currentPage = 1;
let itemsPerPage = 8;
let currentCategory = 'all';
let currentSort = 'date-desc';
let searchQuery = '';
let currentOutfit = null;

// DOM Elements
const outfitGrid = document.getElementById('outfitGrid');
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
const outfitModal = document.getElementById('outfitModal');
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
    filteredOutfits = outfitsData.filter(outfit => {
        const matchesSearch = outfit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            outfit.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = currentCategory === 'all' || outfit.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort
    sortOutfits();

    // Reset page if needed
    const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    renderOutfits();
    renderPagination();
}

function sortOutfits() {
    switch (currentSort) {
        case 'date-desc':
            filteredOutfits.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'date-asc':
            filteredOutfits.sort((a, b) => a.dateAdded - b.dateAdded);
            break;
        case 'likes-desc':
            filteredOutfits.sort((a, b) => b.stats.likes - a.stats.likes);
            break;
        case 'likes-asc':
            filteredOutfits.sort((a, b) => a.stats.likes - b.stats.likes);
            break;
        case 'views-desc':
            filteredOutfits.sort((a, b) => b.stats.views - a.stats.views);
            break;
        case 'views-asc':
            filteredOutfits.sort((a, b) => a.stats.views - b.stats.views);
            break;
        case 'comments-desc':
            filteredOutfits.sort((a, b) => b.stats.comments - a.stats.comments);
            break;
        case 'comments-asc':
            filteredOutfits.sort((a, b) => a.stats.comments - b.stats.comments);
            break;
        case 'title-asc':
            filteredOutfits.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
            break;
        case 'title-desc':
            filteredOutfits.sort((a, b) => b.title.localeCompare(a.title, 'tr'));
            break;
    }
}

function renderOutfits() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageOutfits = filteredOutfits.slice(start, end);

    outfitGrid.innerHTML = pageOutfits.map((outfit, index) => `
        <div class="outfit-card" data-id="${outfit.id}" style="animation-delay: ${index * 0.05}s">
            <div class="card-image">
                <img src="${outfit.image}" alt="${outfit.title}" loading="lazy">
                <div class="card-overlay"></div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${outfit.title}</h3>
                <p class="card-description">${outfit.description}</p>
                <div class="card-creator">
                    <div class="creator-small-avatar">${outfit.creator.avatar}</div>
                    <span class="creator-small-name">${outfit.creator.name}</span>
                </div>
                <div class="card-stats">
                    <span class="card-stat ${outfit.liked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i> ${outfit.stats.likes}
                    </span>
                    <span class="card-stat">
                        <i class="fas fa-comment"></i> ${outfit.stats.comments}
                    </span>
                    <span class="card-stat">
                        <i class="fas fa-eye"></i> ${outfit.stats.views}
                    </span>
                    <span class="card-date">
                        <i class="fas fa-calendar"></i> ${outfit.creator.date}
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    totalCount.textContent = filteredOutfits.length;

    // Add click listeners
    document.querySelectorAll('.outfit-card').forEach(card => {
        card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
    });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);

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
            outfitGrid.classList.add('compact');
        } else {
            outfitGrid.classList.remove('compact');
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
        const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);
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
    outfitModal?.addEventListener('click', (e) => {
        if (e.target === outfitModal) closeModal();
    });

    modalLikeBtn?.addEventListener('click', handleLike);
    modalCopyBtn?.addEventListener('click', handleCopy);
    modalShareBtn?.addEventListener('click', handleShare);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(id) {
    currentOutfit = outfitsData.find(o => o.id === id);
    if (!currentOutfit) return;

    // Increment views
    currentOutfit.stats.views++;

    modalImage.src = currentOutfit.image;
    modalTitle.textContent = currentOutfit.title;
    modalCategory.textContent = currentOutfit.category === 'kadin' ? 'KADIN' : 'ERKEK';
    modalCreatorAvatar.textContent = currentOutfit.creator.avatar;
    modalCreatorName.textContent = currentOutfit.creator.name;
    modalCreatorDate.textContent = currentOutfit.creator.date;
    modalDescription.textContent = currentOutfit.description;
    modalFavorites.textContent = currentOutfit.stats.likes;
    modalComments.textContent = currentOutfit.stats.comments;
    modalViews.textContent = currentOutfit.stats.views;
    modalCopies.textContent = currentOutfit.stats.copies;

    updateLikeButton();
    outfitModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    outfitModal.classList.remove('active');
    document.body.style.overflow = '';
    currentOutfit = null;
    filterAndRender();
}

function updateLikeButton() {
    if (currentOutfit.liked) {
        modalLikeBtn.innerHTML = '<i class="fas fa-heart"></i><span>Beğenildi</span>';
        modalLikeBtn.classList.add('liked');
    } else {
        modalLikeBtn.innerHTML = '<i class="far fa-heart"></i><span>Beğen</span>';
        modalLikeBtn.classList.remove('liked');
    }
}

function handleLike() {
    if (!currentOutfit) return;

    currentOutfit.liked = !currentOutfit.liked;
    currentOutfit.stats.likes += currentOutfit.liked ? 1 : -1;
    modalFavorites.textContent = currentOutfit.stats.likes;
    updateLikeButton();
    showToast(currentOutfit.liked ? 'Beğenildi!' : 'Beğeni kaldırıldı.');
}

function handleCopy() {
    if (!currentOutfit) return;

    currentOutfit.stats.copies++;
    modalCopies.textContent = currentOutfit.stats.copies;

    // Copy outfit code to clipboard
    const code = `OUTFIT_${currentOutfit.id}_${currentOutfit.title.replace(/\s/g, '_').toUpperCase()}`;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Kod panoya kopyalandı!');
    }).catch(() => {
        showToast('Kopyalama başarısız oldu.');
    });
}

function handleShare() {
    if (!currentOutfit) return;

    const shareData = {
        title: currentOutfit.title,
        text: currentOutfit.description,
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
