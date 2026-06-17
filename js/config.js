// ========== KONFIGURASI DEFAULT ==========
const CONFIG = {
    // ===== PROFIL & BRANDING =====
    profileImage: 'https://j.top4top.io/p_38195t90r1.jpg',
    logoImage: 'https://c.top4top.io/p_3819ed0vz1.jpg',
    heroVideo: 'https://files.catbox.moe/vwy06h.mp4',
    websiteTitle: 'FoxxyPortofolio',
    
    // ===== SOSIAL MEDIA =====
    whatsapp: '6281997149736',
    telegram: 'https://t.me/foxxyoffc',
    tiktok: 'https://www.tiktok.com/@foxxyoffc',
    github: 'https://github.com/foxxyoffc',
    gmail: 'foxxy@example.com',
    
    // ===== KOMUNITAS =====
    grupWhatsApp: 'https://chat.whatsapp.com/Fl4UBHHDPpg2DdxpQwHNeK',
    websiteSekte: 'https://sekte-creator-kece.vercel.app',
    
    // ===== QRIS DONASI =====
    qrisImage: 'https://example.com/qris-donasi.jpg',
    
    // ===== LINK DOWNLOADER (FALLBACK) =====
    downloadLinks: {
        tiktok: 'https://tikwm.com',
        pinterest: 'https://pindown.io/id1',
        youtube: 'https://yt1s.com',
        instagram: 'https://snapinsta.app'
    },
    
    // ===== API KEY UNTUK TOOLS =====
    apis: {
        pinterest: {
            url: 'https://api.botcahx.eu.org/api/download/pinterest',
            key: 'alipaiapikeybaru'
        },
        tiktok: {
            url: 'https://tikwm.com/api',
            key: ''
        }
    }
};

// Simpan ke localStorage kalo belum ada
if (!localStorage.getItem('foxxyConfig')) {
    localStorage.setItem('foxxyConfig', JSON.stringify(CONFIG));
}

// Fungsi buat ambil config
function getConfig() {
    const saved = localStorage.getItem('foxxyConfig');
    if (saved) {
        return JSON.parse(saved);
    }
    return CONFIG;
}

// Fungsi buat simpan config
function saveConfig(newConfig) {
    localStorage.setItem('foxxyConfig', JSON.stringify(newConfig));
}

// Export
window.CONFIG = CONFIG;
window.getConfig = getConfig;
window.saveConfig = saveConfig;
