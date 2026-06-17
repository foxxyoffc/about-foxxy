// ========== ADMIN FUNCTIONS ==========

function loadAdminData() {
    const config = getConfig();
    
    // Profile
    document.getElementById('adminProfileImage').value = config.profileImage || '';
    document.getElementById('adminLogoImage').value = config.logoImage || '';
    document.getElementById('adminHeroVideo').value = config.heroVideo || '';
    document.getElementById('adminWebsiteTitle').value = config.websiteTitle || '';
    
    // Sosial Media
    document.getElementById('adminWhatsapp').value = config.whatsapp || '';
    document.getElementById('adminTelegram').value = config.telegram || '';
    document.getElementById('adminTiktok').value = config.tiktok || '';
    document.getElementById('adminGithub').value = config.github || '';
    document.getElementById('adminGmail').value = config.gmail || '';
    
    // Komunitas
    document.getElementById('adminGrupWA').value = config.grupWhatsApp || '';
    document.getElementById('adminWebsiteSekte').value = config.websiteSekte || '';
    
    // QRIS
    document.getElementById('adminQris').value = config.qrisImage || '';
    
    // Download Links
    document.getElementById('adminDlTiktok').value = config.downloadLinks?.tiktok || '';
    document.getElementById('adminDlPinterest').value = config.downloadLinks?.pinterest || '';
    document.getElementById('adminDlYoutube').value = config.downloadLinks?.youtube || '';
    document.getElementById('adminDlInstagram').value = config.downloadLinks?.instagram || '';
    
    // API
    document.getElementById('adminApiPinterestUrl').value = config.apis?.pinterest?.url || '';
    document.getElementById('adminApiPinterestKey').value = config.apis?.pinterest?.key || '';
    document.getElementById('adminApiTiktokUrl').value = config.apis?.tiktok?.url || '';
    document.getElementById('adminApiTiktokKey').value = config.apis?.tiktok?.key || '';
}

function saveAdminData() {
    const newConfig = {
        profileImage: document.getElementById('adminProfileImage').value,
        logoImage: document.getElementById('adminLogoImage').value,
        heroVideo: document.getElementById('adminHeroVideo').value,
        websiteTitle: document.getElementById('adminWebsiteTitle').value,
        
        whatsapp: document.getElementById('adminWhatsapp').value,
        telegram: document.getElementById('adminTelegram').value,
        tiktok: document.getElementById('adminTiktok').value,
        github: document.getElementById('adminGithub').value,
        gmail: document.getElementById('adminGmail').value,
        
        grupWhatsApp: document.getElementById('adminGrupWA').value,
        websiteSekte: document.getElementById('adminWebsiteSekte').value,
        
        qrisImage: document.getElementById('adminQris').value,
        
        downloadLinks: {
            tiktok: document.getElementById('adminDlTiktok').value,
            pinterest: document.getElementById('adminDlPinterest').value,
            youtube: document.getElementById('adminDlYoutube').value,
            instagram: document.getElementById('adminDlInstagram').value
        },
        
        apis: {
            pinterest: {
                url: document.getElementById('adminApiPinterestUrl').value,
                key: document.getElementById('adminApiPinterestKey').value
            },
            tiktok: {
                url: document.getElementById('adminApiTiktokUrl').value,
                key: document.getElementById('adminApiTiktokKey').value
            }
        }
    };
    
    saveConfig(newConfig);
    alert('✅ Setting berhasil disimpan!');
    window.location.reload();
}

// Export
window.loadAdminData = loadAdminData;
window.saveAdminData = saveAdminData;
