// ========== DOM ELEMENTS ==========
let currentTheme = localStorage.getItem('theme') || 'dark';

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavToggle();
    initDateTime();
    initDeviceInfo();
    loadConfig();
});

// ========== THEME TOGGLE ==========
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'flex';
    }
    
    themeToggle.addEventListener('click', () => {
        if (currentTheme === 'dark') {
            document.body.classList.add('light-theme');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'flex';
            currentTheme = 'light';
        } else {
            document.body.classList.remove('light-theme');
            if (sunIcon) sunIcon.style.display = 'flex';
            if (moonIcon) moonIcon.style.display = 'none';
            currentTheme = 'dark';
        }
        localStorage.setItem('theme', currentTheme);
    });
}

// ========== NAV TOGGLE ==========
function initNavToggle() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// ========== DATE & TIME ==========
function initDateTime() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateCard = document.getElementById('dateCard');
    const timeCard = document.getElementById('timeCard');
    
    if (dateCard) {
        dateCard.innerHTML = `<i class="fas fa-calendar-alt"></i> ${now.toLocaleDateString('id-ID', options)}`;
    }
    if (timeCard) {
        timeCard.innerHTML = `<i class="fas fa-clock"></i> ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
}

// ========== DEVICE INFO (BATTERY + CPU) ==========
function initDeviceInfo() {
    // Battery
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const batteryCard = document.getElementById('batteryCard');
            if (batteryCard) {
                const level = Math.round(battery.level * 100);
                batteryCard.innerHTML = `<i class="fas fa-battery-${level > 75 ? 'full' : level > 50 ? 'three-quarters' : level > 25 ? 'quarter' : 'empty'}"></i> Baterai: ${level}%`;
                
                battery.addEventListener('levelchange', () => {
                    const newLevel = Math.round(battery.level * 100);
                    batteryCard.innerHTML = `<i class="fas fa-battery-${newLevel > 75 ? 'full' : newLevel > 50 ? 'three-quarters' : newLevel > 25 ? 'quarter' : 'empty'}"></i> Baterai: ${newLevel}%`;
                });
            }
        }).catch(() => {});
    }
    
    // CPU (approximate)
    const cpuCard = document.getElementById('cpuCard');
    if (cpuCard) {
        const cores = navigator.hardwareConcurrency || 'Unknown';
        cpuCard.innerHTML = `<i class="fas fa-microchip"></i> CPU: ${cores} Core${cores > 1 ? 's' : ''}`;
    }
}

// ========== LOAD CONFIG ==========
function loadConfig() {
    const config = getConfig();
    
    // Update profile image
    const profileImg = document.getElementById('profileImage');
    if (profileImg && config.profileImage) {
        profileImg.src = config.profileImage;
    }
    
    // Update logo
    const logoImg = document.querySelector('.logo-img');
    if (logoImg && config.logoImage) {
        logoImg.src = config.logoImage;
    }
    
    // Update hero video
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo && config.heroVideo) {
        heroVideo.src = config.heroVideo;
    }
    
    // Update website title
    if (config.websiteTitle) {
        document.title = config.websiteTitle;
        const titleEl = document.getElementById('websiteTitle');
        if (titleEl) titleEl.textContent = config.websiteTitle;
    }
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== EXPORT GLOBAL ==========
window.initTheme = initTheme;
window.initNavToggle = initNavToggle;
window.initDateTime = initDateTime;
window.initDeviceInfo = initDeviceInfo;
window.loadConfig = loadConfig;
