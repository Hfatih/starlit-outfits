// RINA OUTFITS - YUKLE JS
const uploadSelection = document.getElementById('uploadSelection');
const uploadFormSection = document.getElementById('uploadFormSection');
const backBtn = document.getElementById('backBtn');
const uploadForm = document.getElementById('uploadForm');
const formIcon = document.getElementById('formIcon');
const formTitle = document.getElementById('formTitle');
const imageUploadArea = document.getElementById('imageUploadArea');
const contentImage = document.getElementById('contentImage');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
let uploadType = 'kombin';
let compressedImage = null; // Store compressed image data

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    if (typeof StarlitDB !== 'undefined') {
        StarlitDB.checkAuth();
    }

    document.querySelectorAll('.upload-option').forEach(option => {
        option.addEventListener('click', () => {
            uploadType = option.dataset.type;
            uploadSelection.style.display = 'none';
            uploadFormSection.style.display = 'block';
            formIcon.innerHTML = uploadType === 'kombin' ? '<i class="fas fa-shirt"></i>' : '<i class="fas fa-user-circle"></i>';
            formTitle.textContent = uploadType === 'kombin' ? 'Kombin Yükle' : 'Yüz Yükle';
        });
    });

    backBtn?.addEventListener('click', () => {
        uploadSelection.style.display = 'block';
        uploadFormSection.style.display = 'none';
        uploadForm.reset();
        resetImagePreview();
    });

    imageUploadArea?.addEventListener('click', () => contentImage.click());

    contentImage?.addEventListener('change', handleFileSelect);

    // Paste Support
    document.addEventListener('paste', (e) => {
        if (uploadFormSection.style.display === 'none') return;

        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let item of items) {
            if (item.type.indexOf('image') === 0) {
                const blob = item.getAsFile();
                handleFileBlob(blob);
                break;
            }
        }
    });

    removeImageBtn?.addEventListener('click', resetImagePreview);

    uploadForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!compressedImage) {
            showToast('Lütfen bir resim seçin veya yapıştırın (Ctrl+V)!', 'error');
            return;
        }

        const code = document.getElementById('contentCode').value.trim();
        if (!code) {
            showToast('Kombin Kodu/Yüz Kodu zorunludur!', 'error');
            document.getElementById('contentCode').focus();
            return;
        }

        const title = document.getElementById('contentTitle').value;
        const category = document.getElementById('contentCategory').value;
        const description = document.getElementById('contentDescription').value;
        const btn = uploadForm.querySelector('.submit-btn');

        // Loading state
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const user = StarlitDB.getCurrentUser();

            const contentData = {
                title: title,
                code: code,
                category: category,
                description: description,
                type: uploadType, // kombin or yuz
                image: compressedImage, // Base64 string
                creatorId: user ? user.id : 'unknown',
                creatorName: user ? user.username : 'Anonim',
                creatorAvatar: user ? user.avatar : '--'
            };

            await StarlitDB.addContent(contentData);

            showToast('İçerik moderasyon onayına gönderildi!', 'success');

            // Reset form
            setTimeout(() => {
                uploadSelection.style.display = 'block';
                uploadFormSection.style.display = 'none';
                uploadForm.reset();
                resetImagePreview();
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
                btn.style.opacity = '1';
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            showToast('Yükleme başarısız oldu.', 'error');
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });
});

async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handleFileBlob(file);
}

async function handleFileBlob(file) {
    if (file) {
        try {
            // Show loading state
            imageUploadArea.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Resim işleniyor...</p>';

            // Compress Image
            compressedImage = await compressImage(file, 1); // Max 1MB

            // Show Preview
            previewImg.src = compressedImage;
            imagePreview.classList.add('active');
            imageUploadArea.style.display = 'none';

            // Reset upload area text
            setTimeout(() => {
                imageUploadArea.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Resim Seç veya Sürükle</p><span>PNG, JPG, GIF (Max 5MB)</span>';
            }, 500);
        } catch (error) {
            console.error('Compression error:', error);
            showToast('Resim işlenirken bir hata oluştu', 'error');
            resetImagePreview();
        }
    }
}

function resetImagePreview() {
    previewImg.src = '';
    imagePreview.classList.remove('active');
    imageUploadArea.style.display = 'block';
    contentImage.value = '';
    compressedImage = null;
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.style.background = type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Image Compression Function
async function compressImage(file, maxSizeMB = 1) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if too big (max 1200px width/height for reasonable quality/size trade-off)
                const MAX_DIMENSION = 1200;
                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Start with high quality 0.9
                let quality = 0.9;
                let dataUrl = canvas.toDataURL('image/jpeg', quality);

                // Reduce quality steps if file is too large
                while (dataUrl.length > maxSizeMB * 1024 * 1024 && quality > 0.3) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                }

                resolve(dataUrl);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}
