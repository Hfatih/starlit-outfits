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

document.addEventListener('DOMContentLoaded', () => {
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
        previewImg.src = '';
        imagePreview.classList.remove('active');
        imageUploadArea.style.display = 'block';
    });

    imageUploadArea?.addEventListener('click', () => contentImage.click());

    contentImage?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                previewImg.src = ev.target.result;
                imagePreview.classList.add('active');
                imageUploadArea.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn?.addEventListener('click', () => {
        previewImg.src = '';
        imagePreview.classList.remove('active');
        imageUploadArea.style.display = 'block';
        contentImage.value = '';
    });

    uploadForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = uploadForm.querySelector('.submit-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        btn.disabled = true;
        setTimeout(() => {
            toastMessage.textContent = 'İçerik moderasyon onayına gönderildi!';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Onaya Gönder';
            btn.disabled = false;
            uploadSelection.style.display = 'block';
            uploadFormSection.style.display = 'none';
            uploadForm.reset();
        }, 1500);
    });
});
