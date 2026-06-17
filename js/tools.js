// ========== TOOLS FUNCTIONS ==========
// Semua fungsi untuk downloader, stalking, check, dll.

// ========== PINTEREST DOWNLOADER (PAKE API FAA) ==========
async function downloadPinterest() {
    const urlInput = document.getElementById('pinterestUrl');
    const resultDiv = document.getElementById('pinterestResult');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Masukkan URL Pinterest terlebih dahulu!');
        return;
    }
    
    if (!url.match(/pinterest\.com|pin\.it/i)) {
        alert('❌ URL bukan dari Pinterest!');
        return;
    }
    
    resultDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Memproses...</div>';
    
    try {
        const apiUrl = `https://api-faa.my.id/faa/pin-down?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.result) {
            const media = data.result;
            
            if (media.video || media.url?.includes('.mp4')) {
                const videoUrl = media.video || media.url;
                resultDiv.innerHTML = `
                    <div class="video-preview">
                        <video src="${videoUrl}" controls></video>
                        <div class="video-info">
                            <p><strong><i class="fab fa-pinterest"></i> Judul:</strong> ${media.title || 'Pinterest Video'}</p>
                            <a href="${videoUrl}" download class="download-link"><i class="fas fa-download"></i> Download Video</a>
                        </div>
                    </div>
                `;
            } else if (media.image) {
                resultDiv.innerHTML = `
                    <div class="video-preview">
                        <img src="${media.image}" style="width: 100%; border-radius: 15px;" alt="Pinterest Image">
                        <div class="video-info">
                            <p><strong><i class="fab fa-pinterest"></i> Judul:</strong> ${media.title || 'Pinterest Image'}</p>
                            <a href="${media.image}" download class="download-link"><i class="fas fa-download"></i> Download Gambar</a>
                        </div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = '<div class="alert alert-info">Media tidak ditemukan.</div>';
            }
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-exclamation-triangle"></i> Gagal memproses. Coba gunakan tools alternatif di bawah:
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 15px;">
                    <a href="https://pindown.io/id1" target="_blank" class="btn btn-primary">Buka PinDown.io</a>
                    <a href="https://klickpin.com/id/" target="_blank" class="btn btn-secondary">Buka KlickPin</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Pinterest Download Error:', error);
        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-exclamation-triangle"></i> Error. Coba gunakan tools alternatif di bawah:
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 15px;">
                <a href="https://pindown.io/id1" target="_blank" class="btn btn-primary">Buka PinDown.io</a>
                <a href="https://klickpin.com/id/" target="_blank" class="btn btn-secondary">Buka KlickPin</a>
            </div>
        `;
    }
}

// ========== TIKTOK DOWNLOADER ==========
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

// ========== COPY CAPTION ==========
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

// ========== YOUTUBE DOWNLOADER (PAKE API FAA) ==========
async function downloadYouTube(type = 'video') {
    const urlInput = document.getElementById('youtubeUrl');
    const resultDiv = document.getElementById('youtubeResult');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Masukkan URL YouTube terlebih dahulu!');
        return;
    }
    
    resultDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Memproses video...</div>';
    
    try {
        // PAKE API FAA - beda endpoint buat video & audio
        const endpoint = type === 'video' ? 'ytmp4' : 'ytmp3';
        const apiUrl = `https://api-faa.my.id/faa/${endpoint}?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.result) {
            const media = data.result;
            const title = media.title || 'YouTube Video';
            const duration = media.duration || 'Unknown';
            
            if (type === 'video') {
                // Video (MP4)
                const videoUrl = media.video || media.url;
                resultDiv.innerHTML = `
                    <div class="video-preview">
                        <video src="${videoUrl}" controls></video>
                        <div class="video-info">
                            <p><strong><i class="fab fa-youtube"></i> Judul:</strong> ${title}</p>
                            <p><strong><i class="fas fa-clock"></i> Durasi:</strong> ${duration}</p>
                            <a href="${videoUrl}" download class="download-link"><i class="fas fa-download"></i> Download Video (MP4)</a>
                        </div>
                    </div>
                `;
            } else {
                // Audio (MP3)
                const audioUrl = media.audio || media.url;
                resultDiv.innerHTML = `
                    <div class="video-preview">
                        <div style="text-align: center; padding: 20px;">
                            <i class="fas fa-music" style="font-size: 3rem; color: var(--neon-blue);"></i>
                        </div>
                        <div class="video-info">
                            <p><strong><i class="fab fa-youtube"></i> Judul:</strong> ${title}</p>
                            <p><strong><i class="fas fa-clock"></i> Durasi:</strong> ${duration}</p>
                            <p><strong><i class="fas fa-file-audio"></i> Format:</strong> MP3</p>
                            <a href="${audioUrl}" download class="download-link"><i class="fas fa-download"></i> Download Audio (MP3)</a>
                        </div>
                    </div>
                `;
            }
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-exclamation-triangle"></i> Gagal memproses. 
                    <a href="${getConfig().downloadLinks?.youtube || 'https://yt1s.com'}" target="_blank" style="color: var(--neon-blue);">Buka link resmi</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('YouTube Download Error:', error);
        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-exclamation-triangle"></i> Error. 
                <a href="${getConfig().downloadLinks?.youtube || 'https://yt1s.com'}" target="_blank" style="color: var(--neon-blue);">Buka link resmi</a>
            </div>
        `;
    }
}

// ========== INSTAGRAM DOWNLOADER (PAKE API FAA) ==========
async function downloadInstagram() {
    const urlInput = document.getElementById('instagramUrl');
    const resultDiv = document.getElementById('instagramResult');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Masukkan URL Instagram terlebih dahulu!');
        return;
    }
    
    resultDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Memproses...</div>';
    
    try {
        // PAKE API FAA
        const apiUrl = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.result) {
            const media = data.result;
            
            // Cek apakah video atau gambar
            if (media.video || media.url?.includes('.mp4')) {
                const videoUrl = media.video || media.url;
                resultDiv.innerHTML = `
                    <div class="video-preview">
                        <video src="${videoUrl}" controls></video>
                        <div class="video-info">
                            <p><strong><i class="fab fa-instagram"></i> Username:</strong> ${media.username || 'Unknown'}</p>
                            <p class="video-caption"><strong><i class="fas fa-caption"></i> Caption:</strong> ${(media.caption || 'Tidak ada caption').substring(0, 200)}</p>
                            <a href="${videoUrl}" download class="download-link"><i class="fas fa-download"></i> Download Video</a>
                        </div>
                    </div>
                `;
            } else if (media.image) {
                resultDiv.innerHTML = `
                    <div class="video-preview">
                        <img src="${media.image}" style="width: 100%; border-radius: 15px;" alt="Instagram Image">
                        <div class="video-info">
                            <p><strong><i class="fab fa-instagram"></i> Username:</strong> ${media.username || 'Unknown'}</p>
                            <p class="video-caption"><strong><i class="fas fa-caption"></i> Caption:</strong> ${(media.caption || 'Tidak ada caption').substring(0, 200)}</p>
                            <a href="${media.image}" download class="download-link"><i class="fas fa-download"></i> Download Gambar</a>
                        </div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = '<div class="alert alert-info">Media tidak ditemukan.</div>';
            }
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-exclamation-triangle"></i> Gagal memproses. Coba gunakan tools alternatif di bawah:
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 15px;">
                    <a href="https://snapinsta.app" target="_blank" class="btn btn-primary">Buka SnapInsta</a>
                    <a href="https://saveinsta.app" target="_blank" class="btn btn-secondary">Buka SaveInsta</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Instagram Download Error:', error);
        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-exclamation-triangle"></i> Error. Coba gunakan tools alternatif di bawah:
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 15px;">
                <a href="https://snapinsta.app" target="_blank" class="btn btn-primary">Buka SnapInsta</a>
                <a href="https://saveinsta.app" target="_blank" class="btn btn-secondary">Buka SaveInsta</a>
            </div>
        `;
    }
}

// ========== STALKING FUNCTIONS ==========

// Stalk TikTok
async function stalkTiktok() {
    const input = document.getElementById('usernameInput');
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    let username = input.value.trim();
    
    if (!username) {
        alert('Masukkan username TikTok terlebih dahulu!');
        return;
    }
    username = username.replace('@', '').trim();
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Mencari data...</div>';
    
    try {
        const response = await fetch(`https://api.botcahx.eu.org/api/stalk/tiktok?apikey=alipaiapikeybaru&username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        if (data && data.result) {
            const user = data.result;
            resultContent.innerHTML = `
                <div class="profile">
                    <img src="${user.avatar || 'https://via.placeholder.com/80x80?text=No+Avatar'}" alt="Avatar">
                    <div>
                        <div class="name">${user.name || user.username}</div>
                        <div class="username">@${user.username}</div>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat"><div class="number">${user.followers || 0}</div><div class="label">Followers</div></div>
                    <div class="stat"><div class="number">${user.likes || 0}</div><div class="label">Likes</div></div>
                    <div class="stat"><div class="number">${user.following || 0}</div><div class="label">Following</div></div>
                    <div class="stat"><div class="number">${user.videos || 0}</div><div class="label">Videos</div></div>
                </div>
                ${user.bio ? `<div class="bio"><strong>Bio:</strong> ${user.bio}</div>` : ''}
            `;
        } else {
            resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Akun tidak ditemukan atau username salah.</div>';
        }
    } catch (error) {
        resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error. Coba lagi nanti.</div>';
    }
}

// ========== STALK INSTAGRAM (PAKE API FAA) ==========
async function stalkIg() {
    const input = document.getElementById('usernameInput');
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    let username = input.value.trim();
    
    if (!username) {
        alert('Masukkan username Instagram terlebih dahulu!');
        return;
    }
    username = username.replace('@', '').trim();
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Mencari data...</div>';
    
    try {
        // PAKE API FAA
        const apiUrl = `https://api-faa.my.id/faa/igstalk?username=${encodeURIComponent(username)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.result) {
            const user = data.result;
            
            // Map response dari FAA
            const profilePic = user.profile_pic || user.avatar || 'https://via.placeholder.com/80x80?text=No+Avatar';
            const fullName = user.full_name || user.name || user.username;
            const bio = user.bio || user.biography || '';
            const followers = user.followers || user.follower_count || 0;
            const following = user.following || user.following_count || 0;
            const posts = user.posts || user.media_count || 0;
            
            resultContent.innerHTML = `
                <div class="profile">
                    <img src="${profilePic}" alt="Avatar">
                    <div>
                        <div class="name">${fullName}</div>
                        <div class="username">@${user.username}</div>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat"><div class="number">${followers}</div><div class="label">Followers</div></div>
                    <div class="stat"><div class="number">${following}</div><div class="label">Following</div></div>
                    <div class="stat"><div class="number">${posts}</div><div class="label">Posts</div></div>
                </div>
                ${bio ? `<div class="bio"><strong>Bio:</strong> ${bio}</div>` : ''}
                ${user.is_private ? `<div class="bio" style="color: #ffaa00;"><strong>🔒 Akun Private</strong></div>` : ''}
                ${user.is_verified ? `<div class="bio" style="color: #00ff88;"><strong>✅ Verified</strong></div>` : ''}
            `;
        } else {
            resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Akun tidak ditemukan atau username salah.</div>';
        }
    } catch (error) {
        console.error('Instagram Stalk Error:', error);
        resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error. Coba lagi nanti.</div>';
    }
}

// Stalk Mobile Legends
async function stalkMl() {
    const input = document.getElementById('nickInput');
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    const nickname = input.value.trim();
    
    if (!nickname) {
        alert('Masukkan nickname ML terlebih dahulu!');
        return;
    }
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Mencari data...</div>';
    
    try {
        const response = await fetch(`https://api.botcahx.eu.org/api/stalk/ml?apikey=alipaiapikeybaru&query=${encodeURIComponent(nickname)}`);
        const data = await response.json();
        
        if (data && data.result) {
            const user = data.result;
            resultContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--neon-blue);">${user.nickname || nickname}</div>
                    <div style="color: var(--text-secondary);">ID: ${user.id || '-'} (${user.server || '-'})</div>
                </div>
                <div class="stats">
                    <div class="stat"><div class="number">${user.rank || '-'}</div><div class="label">Rank Saat Ini</div></div>
                    <div class="stat"><div class="number">${user.highest_rank || '-'}</div><div class="label">Rank Tertinggi</div></div>
                    <div class="stat"><div class="number">${user.favorite_hero || '-'}</div><div class="label">Hero Favorit</div></div>
                </div>
                ${user.collector ? `<div class="info-row"><span>Kolektor</span><span><strong>${user.collector}</strong></span></div>` : ''}
                ${user.titles ? `<div class="info-row"><span>Title</span><span><strong>${user.titles}</strong></span></div>` : ''}
            `;
        } else {
            resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Akun tidak ditemukan atau nickname salah.</div>';
        }
    } catch (error) {
        resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error. Coba lagi nanti.</div>';
    }
}

// Stalk Free Fire
async function stalkFf() {
    const input = document.getElementById('nickInput');
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    const nickname = input.value.trim();
    
    if (!nickname) {
        alert('Masukkan nickname FF terlebih dahulu!');
        return;
    }
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Mencari data...</div>';
    
    try {
        const response = await fetch(`https://api.botcahx.eu.org/api/stalk/ff?apikey=alipaiapikeybaru&query=${encodeURIComponent(nickname)}`);
        const data = await response.json();
        
        if (data && data.result) {
            const user = data.result;
            resultContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--neon-blue);">${user.nickname || nickname}</div>
                    <div style="color: var(--text-secondary);">ID: ${user.id || '-'}</div>
                </div>
                <div class="stats">
                    <div class="stat"><div class="number">${user.level || '-'}</div><div class="label">Level</div></div>
                    <div class="stat"><div class="number">${user.rank || '-'}</div><div class="label">Rank</div></div>
                    <div class="stat"><div class="number">${user.favorite_character || '-'}</div><div class="label">Character Favorit</div></div>
                </div>
                ${user.guild ? `<div class="info-row"><span>Guild</span><span><strong>${user.guild}</strong></span></div>` : ''}
                ${user.battle_points ? `<div class="info-row"><span>Battle Points</span><span><strong>${user.battle_points}</strong></span></div>` : ''}
                ${user.diamonds ? `<div class="info-row"><span>Diamonds</span><span><strong>${user.diamonds}</strong></span></div>` : ''}
            `;
        } else {
            resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Akun tidak ditemukan atau nickname salah.</div>';
        }
    } catch (error) {
        resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error. Coba lagi nanti.</div>';
    }
}

// ========== CHECK FUNCTIONS ==========

// Check Website (simulasi)
async function checkWebsite() {
    const input = document.getElementById('webUrl');
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    const url = input.value.trim();
    
    if (!url) {
        alert('Masukkan URL website terlebih dahulu!');
        return;
    }
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Memeriksa website...</div>';
    
    setTimeout(() => {
        const isHttps = url.startsWith('https://');
        const hasMaliciousPattern = /(login|verify|secure|bank|paypal|gift|free)/i.test(url) && !isHttps;
        
        let status, statusText, details = [];
        
        if (hasMaliciousPattern) {
            status = 'danger';
            statusText = '⚠️ Website Berpotensi Berbahaya';
            details = ['Mengandung kata-kata yang sering digunakan oleh situs phishing', 'Tidak menggunakan protokol HTTPS yang aman'];
        } else if (!isHttps) {
            status = 'warning';
            statusText = '⚠️ Website Tidak Aman (HTTP)';
            details = ['Tidak menggunakan protokol HTTPS (data tidak terenkripsi)', 'Rentan terhadap serangan man-in-the-middle'];
        } else {
            status = 'safe';
            statusText = '✅ Website Aman';
            details = ['Menggunakan protokol HTTPS (data terenkripsi)', 'Tidak terdeteksi pola mencurigakan'];
        }
        
        const badgeClass = status === 'safe' ? 'badge-safe' : status === 'danger' ? 'badge-danger' : 'badge-warning';
        
        resultContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <span class="badge ${badgeClass}" style="font-size: 1.1rem; padding: 8px 20px;">${statusText}</span>
            </div>
            <div style="margin-bottom: 15px;">
                <div class="info-row"><span>URL</span><span><strong>${url}</strong></span></div>
                <div class="info-row"><span>Protokol</span><span><strong>${isHttps ? '✅ HTTPS (Aman)' : '❌ HTTP (Tidak Aman)'}</strong></span></div>
            </div>
            <div style="background: var(--glass-bg); padding: 15px; border-radius: 12px;">
                <strong style="color: var(--neon-blue);">Detail Pengecekan:</strong>
                <ul style="list-style: none; padding: 0; margin-top: 10px;">
                    ${details.map(d => `<li style="padding: 5px 0; color: var(--text-secondary);"><i class="fas fa-circle" style="font-size: 0.5rem; color: var(--neon-blue); margin-right: 10px;"></i>${d}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-top: 15px; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
                <i class="fas fa-info-circle"></i> Pengecekan ini bersifat dasar. Untuk hasil lebih akurat, gunakan <a href="https://www.virustotal.com" target="_blank" style="color: var(--neon-blue);">VirusTotal</a>
            </div>
        `;
    }, 1000);
}

// ========== WEB MAKER FUNCTIONS ==========

function createWebMaker() {
    const input = document.getElementById('webUrl');
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    const url = input.value.trim();
    
    if (!url) {
        alert('Masukkan URL website terlebih dahulu!');
        return;
    }
    
    resultDiv.classList.add('show');
    
    try {
        const domain = new URL(url).hostname;
        const structure = {
            'index.html': `<html><head><title>${domain}</title></head><body><h1>Welcome to ${domain}</h1></body></html>`,
            'style.css': `/* CSS untuk ${domain} */\nbody { font-family: Arial; }`,
            'script.js': `// JavaScript untuk ${domain}\nconsole.log('Hello World!');`
        };
        
        const fileList = Object.keys(structure);
        
        resultContent.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div class="info-row"><span>Website</span><span><strong>${url}</strong></span></div>
                <div class="info-row"><span>Domain</span><span><strong>${domain}</strong></span></div>
                <div class="info-row"><span>Total File</span><span><strong>${fileList.length} file</strong></span></div>
            </div>
            <div class="structure-grid">
                <div>
                    <strong style="color: var(--neon-blue);">📁 Struktur Folder:</strong>
                    <div class="file-tree">
                        <div class="folder">📁 project-${domain}/</div>
                        ${fileList.map(f => `&nbsp;&nbsp;&nbsp;&nbsp;<div class="file">📄 ${f}</div>`).join('')}
                    </div>
                </div>
                <div>
                    <strong style="color: var(--neon-blue);">📋 Detail File:</strong>
                    ${fileList.map(f => `<div class="info-row"><span>${f}</span><span><strong>${(structure[f].length / 1024).toFixed(2)} KB</strong></span></div>`).join('')}
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="downloadZip()" class="download-link"><i class="fas fa-download"></i> Download ZIP</button>
            </div>
            <div style="margin-top: 15px; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
                <i class="fas fa-info-circle"></i> ZIP berisi file HTML, CSS, JS, dan assets website
            </div>
        `;
        
        window._zipData = { structure, domain };
    } catch (error) {
        resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error. Coba lagi nanti.</div>';
    }
}

function downloadZip() {
    const data = window._zipData;
    if (!data) {
        alert('Tidak ada data untuk di-download!');
        return;
    }
    alert(`✅ Download ZIP untuk ${data.domain} akan dimulai!\n\nFile yang tersedia:\n${Object.keys(data.structure).join('\n')}`);
}

// ========== TRADING FUNCTIONS ==========
const TRADING_API_KEY = 'CG-VeR2FXGunnhDevotZmg8bMej';
const TRADING_BASE_URL = 'https://api.coingecko.com/api/v3';

async function loadTradingData(category) {
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = `<div class="alert alert-info"><span class="loading-spinner"></span> Memuat data ${category}...</div>`;

    try {
        let ids = [];
        let vsCurrency = 'usd';

        if (category === 'crypto') {
            ids = ['bitcoin', 'ethereum', 'ripple', 'solana', 'cardano', 'polkadot', 'dogecoin', 'avalanche', 'chainlink', 'polygon'];
        } else if (category === 'meme') {
            ids = ['dogecoin', 'shiba-inu', 'pepe', 'floki', 'bonk', 'mog-coin', 'brett', 'popcat', 'cat-in-a-dogs-world', 'neiro'];
        } else if (category === 'forex') {
            showForexData();
            return;
        }

        const url = `${TRADING_BASE_URL}/simple/price?ids=${ids.join(',')}&vs_currencies=${vsCurrency}&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&x_cg_demo_api_key=${TRADING_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && Object.keys(data).length > 0) {
            let html = `<div class="market-grid">`;
            const sortedIds = ids.filter(id => data[id]);

            sortedIds.forEach(id => {
                const item = data[id];
                const price = item[vsCurrency] || 0;
                const change = item[`${vsCurrency}_24h_change`] || 0;
                const vol = item[`${vsCurrency}_24h_vol`] || 0;
                const isUp = change >= 0;
                const symbol = id === 'bitcoin' ? 'BTC' :
                               id === 'ethereum' ? 'ETH' :
                               id === 'ripple' ? 'XRP' :
                               id === 'solana' ? 'SOL' :
                               id === 'cardano' ? 'ADA' :
                               id === 'polkadot' ? 'DOT' :
                               id === 'dogecoin' ? 'DOGE' :
                               id === 'avalanche' ? 'AVAX' :
                               id === 'chainlink' ? 'LINK' :
                               id === 'polygon' ? 'MATIC' :
                               id === 'shiba-inu' ? 'SHIB' :
                               id === 'pepe' ? 'PEPE' :
                               id === 'floki' ? 'FLOKI' :
                               id === 'bonk' ? 'BONK' :
                               id === 'mog-coin' ? 'MOG' :
                               id === 'brett' ? 'BRETT' :
                               id === 'popcat' ? 'POPCAT' :
                               id === 'cat-in-a-dogs-world' ? 'MEW' :
                               id === 'neiro' ? 'NEIRO' :
                               id.toUpperCase();

                const priceFormatted = price < 0.01 ? price.toFixed(8) : price < 1 ? price.toFixed(4) : price.toFixed(2);
                const volFormatted = vol > 1e9 ? (vol / 1e9).toFixed(2) + 'B' : vol > 1e6 ? (vol / 1e6).toFixed(2) + 'M' : vol.toFixed(0);

                html += `
                    <div class="market-item">
                        <div class="rank">#${sortedIds.indexOf(id) + 1}</div>
                        <div class="symbol">${symbol}</div>
                        <div class="name">${id.replace(/-/g, ' ').toUpperCase()}</div>
                        <div class="price ${isUp ? 'price-up' : 'price-down'}">$${priceFormatted}</div>
                        <div class="change ${isUp ? 'price-up' : 'price-down'}">${isUp ? '+' : ''}${change.toFixed(2)}%</div>
                        <div class="volume">Vol: $${volFormatted}</div>
                    </div>
                `;
            });

            html += `</div>`;
            html += `<div style="margin-top: 15px; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
                        <i class="fas fa-info-circle"></i> Data real-time dari CoinGecko
                    </div>`;
            resultContent.innerHTML = html;
        } else {
            resultContent.innerHTML = `<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Gagal memuat data. Coba lagi nanti.</div>`;
        }

    } catch (error) {
        console.error('CoinGecko Error:', error);
        resultContent.innerHTML = `<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error: ${error.message}. Coba lagi nanti.</div>`;
    }
}

function showForexData() {
    const resultContent = document.getElementById('resultContent');
    const forexData = [
        { symbol: 'USD/IDR', price: '15,850', change: '+0.2%', up: true },
        { symbol: 'EUR/USD', price: '1.0850', change: '-0.1%', up: false },
        { symbol: 'USD/JPY', price: '154.30', change: '+0.4%', up: true },
        { symbol: 'GBP/USD', price: '1.2650', change: '+0.3%', up: true },
        { symbol: 'AUD/USD', price: '0.6580', change: '+0.1%', up: true },
        { symbol: 'USD/CHF', price: '0.8920', change: '-0.2%', up: false }
    ];

    let html = `<div class="market-grid">`;
    forexData.forEach(item => {
        html += `
            <div class="market-item">
                <div class="symbol">${item.symbol}</div>
                <div class="price ${item.up ? 'price-up' : 'price-down'}">${item.price}</div>
                <div class="change ${item.up ? 'price-up' : 'price-down'}">${item.change}</div>
            </div>
        `;
    });
    html += `</div>`;
    html += `<div style="margin-top: 15px; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
                <i class="fas fa-info-circle"></i> Data Forex simulasi. Untuk real-time gunakan API Forex.
            </div>`;
    resultContent.innerHTML = html;
}

// ========== DEVICE INFO ==========
async function getDeviceInfo() {
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Mengumpulkan informasi device...</div>';
    
    try {
        const deviceInfo = {
            name: navigator.userAgentData?.platform || navigator.platform || 'Unknown',
            brand: navigator.userAgentData?.brands ? navigator.userAgentData.brands.map(b => b.brand).join(', ') : 'Unknown',
            ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Tidak tersedia',
            cores: navigator.hardwareConcurrency || 'Tidak tersedia',
            battery: await getBatteryLevel(),
            storage: await getStorageInfo(),
            screen: `${window.screen.width}x${window.screen.height}`,
            colorDepth: `${window.screen.colorDepth} bit`,
            language: navigator.language,
            online: navigator.onLine ? 'Online' : 'Offline',
            touchSupport: 'ontouchstart' in window ? '✅ Ya' : '❌ Tidak'
        };
        
        resultContent.innerHTML = `
            <div class="device-name">${deviceInfo.name}</div>
            <div style="text-align: center; color: var(--text-secondary); margin-bottom: 15px;">${deviceInfo.brand}</div>
            <div class="device-grid">
                <div class="info-row"><span class="label">Device Name</span><span class="value">${deviceInfo.name}</span></div>
                <div class="info-row"><span class="label">Brand/Model</span><span class="value">${deviceInfo.brand}</span></div>
                <div class="info-row"><span class="label">RAM</span><span class="value">${deviceInfo.ram}</span></div>
                <div class="info-row"><span class="label">CPU Cores</span><span class="value">${deviceInfo.cores}</span></div>
                <div class="info-row"><span class="label">Baterai</span><span class="value">${deviceInfo.battery}</span></div>
                <div class="info-row"><span class="label">Penyimpanan</span><span class="value">${deviceInfo.storage}</span></div>
                <div class="info-row"><span class="label">Resolusi Layar</span><span class="value">${deviceInfo.screen}</span></div>
                <div class="info-row"><span class="label">Color Depth</span><span class="value">${deviceInfo.colorDepth}</span></div>
                <div class="info-row"><span class="label">Bahasa</span><span class="value">${deviceInfo.language}</span></div>
                <div class="info-row"><span class="label">Status Koneksi</span><span class="value">${deviceInfo.online}</span></div>
                <div class="info-row"><span class="label">Touch Support</span><span class="value">${deviceInfo.touchSupport}</span></div>
            </div>
            <div style="margin-top: 15px; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
                <i class="fas fa-info-circle"></i> Informasi device yang terdeteksi oleh browser
            </div>
        `;
    } catch (error) {
        resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Error. Coba lagi nanti.</div>';
    }
}

async function getBatteryLevel() {
    try {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? '🔌 Charging' : '🔋 Tidak Charging';
            return `${level}% (${charging})`;
        }
        return 'Tidak tersedia';
    } catch {
        return 'Tidak tersedia';
    }
}

async function getStorageInfo() {
    try {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            const total = (estimate.quota / (1024 * 1024 * 1024)).toFixed(2);
            const used = (estimate.usage / (1024 * 1024 * 1024)).toFixed(2);
            return `${used} GB / ${total} GB (terpakai)`;
        }
        return 'Tidak tersedia';
    } catch {
        return 'Tidak tersedia';
    }
}

// ========== MATA UANG (FRANKFURTER API) ==========
async function convertCurrency() {
    const amountInput = document.getElementById('amountInput');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const resultDiv = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        alert('Masukkan jumlah yang valid!');
        return;
    }
    
    const from = fromSelect.value;
    const to = toSelect.value;
    
    resultDiv.classList.add('show');
    resultContent.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> Mengkonversi...</div>';
    
    try {
        const url = `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.rates && data.rates[to]) {
            const rate = data.rates[to];
            const result = amount * rate;
            const date = data.date || new Date().toISOString().split('T')[0];
            
            resultContent.innerHTML = `
                <div class="result-value">
                    ${amount.toLocaleString('id-ID')} ${from} = 
                    <span style="color: #00ff88;">${result.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> ${to}
                </div>
                <div class="info-row">
                    <span class="label">Kurs</span>
                    <span class="value">1 ${from} = ${rate.toFixed(4)} ${to}</span>
                </div>
                <div class="info-row">
                    <span class="label">Tanggal Update</span>
                    <span class="value">${date}</span>
                </div>
                <div class="info-row">
                    <span class="label">Sumber Data</span>
                    <span class="value">European Central Bank (ECB)</span>
                </div>
                <div style="margin-top: 15px; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
                    <i class="fas fa-info-circle"></i> Data real-time dari Frankfurter API
                </div>
            `;
        } else {
            resultContent.innerHTML = `<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Kurs untuk ${from} ke ${to} tidak tersedia.</div>`;
        }
    } catch (error) {
        console.error('Frankfurter API Error:', error);
        resultContent.innerHTML = `<div class="alert alert-info"><i class="fas fa-exclamation-triangle"></i> Gagal mengambil data kurs. Coba lagi nanti.</div>`;
    }
}

// ========== EXPORT FUNCTIONS ==========
window.downloadPinterest = downloadPinterest;
window.downloadTiktok = downloadTiktok;
window.downloadYouTube = downloadYouTube;
window.downloadInstagram = downloadInstagram;
window.copyCaption = copyCaption;
window.copyCaptionText = copyCaptionText;
window.stalkTiktok = stalkTiktok;
window.stalkIg = stalkIg;
window.stalkMl = stalkMl;
window.stalkFf = stalkFf;
window.checkWebsite = checkWebsite;
window.createWebMaker = createWebMaker;
window.downloadZip = downloadZip;
window.loadTradingData = loadTradingData;
window.showForexData = showForexData;
window.getDeviceInfo = getDeviceInfo;
window.convertCurrency = convertCurrency;
window.getBatteryLevel = getBatteryLevel;
window.getStorageInfo = getStorageInfo;
