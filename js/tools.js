// ========== TOOLS FUNCTIONS ==========

// ===== TIKTOK DOWNLOADER =====
async function downloadTiktok() {
    const urlInput = document.getElementById('tiktokUrl');
    const resultDiv = document.getElementById('tiktokResult');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Masukkan URL TikTok terlebih dahulu!');
        return;
    }
    
    resultDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Memproses...</div>';
    
    try {
        const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.code === 0) {
            const videoUrl = data.data.play;
            const title = data.data.title || 'TikTok Video';
            const author = data.data.author?.unique_id || 'Unknown';
            const duration = data.data.duration || '0';
            const music = data.data.music_info?.title || 'Unknown';
            
            resultDiv.innerHTML = `
                <div class="video-preview">
                    <video src="${videoUrl}" controls poster="${data.data.cover || ''}"></video>
                    <div class="video-info">
                        <p><strong><i class="fab fa-tiktok"></i> Author:</strong> @${author}</p>
                        <p><strong><i class="fas fa-clock"></i> Durasi:</strong> ${duration} detik</p>
                        <p><strong><i class="fas fa-music"></i> Musik:</strong> ${music}</p>
                        <p class="video-caption"><strong><i class="fas fa-caption"></i> Caption:</strong> ${title.substring(0, 300)}${title.length > 300 ? '...' : ''}</p>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
                            <a href="${videoUrl}" download class="download-link"><i class="fas fa-download"></i> Download Video (HD)</a>
                            <button onclick="copyCaption()" class="download-link" style="background: var(--glass-bg); color: var(--neon-blue); border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer;">
                                <i class="fas fa-copy"></i> Salin Caption
                            </button>
                            <a href="${getConfig().downloadLinks?.tiktok || 'https://tikwm.com'}" target="_blank" class="download-link" style="background: var(--glass-bg); color: var(--neon-blue); text-decoration: none; padding: 10px 20px; border-radius: 30px;">
                                <i class="fas fa-external-link-alt"></i> Buka Link Resmi
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Gagal memproses. <a href="${getConfig().downloadLinks?.tiktok || 'https://tikwm.com'}" target="_blank" style="color: var(--neon-blue);">Klik di sini untuk buka link resmi</a></div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error. <a href="${getConfig().downloadLinks?.tiktok || 'https://tikwm.com'}" target="_blank" style="color: var(--neon-blue);">Buka link resmi</a></div>`;
    }
}

// ===== COPY CAPTION =====
function copyCaption() {
    const captionText = document.querySelector('.video-caption');
    if (captionText) {
        let text = captionText.innerText.replace('📝 Caption:', '').trim();
        text = text.replace('Caption:', '').trim();
        navigator.clipboard.writeText(text);
        alert('✅ Caption berhasil disalin!');
    } else {
        alert('Tidak ada caption untuk disalin.');
    }
}

// ===== EXPORT =====
window.downloadTiktok = downloadTiktok;
window.copyCaption = copyCaption;
