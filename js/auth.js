// ========== AUTHENTICATION ==========

// Default credentials
let devCredentials = JSON.parse(localStorage.getItem('devCredentials')) || [
    { username: 'foxxy', password: 'foxxy2026' }
];

function saveDevCredentials() {
    localStorage.setItem('devCredentials', JSON.stringify(devCredentials));
}

function loginDeveloper(username, password) {
    const dev = devCredentials.find(d => d.username === username && d.password === password);
    if (dev) {
        sessionStorage.setItem('isDevLoggedIn', 'true');
        sessionStorage.setItem('devUsername', username);
        return true;
    }
    return false;
}

function isDevLoggedIn() {
    return sessionStorage.getItem('isDevLoggedIn') === 'true';
}

function logout() {
    sessionStorage.removeItem('isDevLoggedIn');
    sessionStorage.removeItem('devUsername');
    window.location.href = '../index.html';
}

function addDevUser(username, password) {
    if (!devCredentials.find(d => d.username === username)) {
        devCredentials.push({ username, password });
        saveDevCredentials();
        return true;
    }
    return false;
}

function removeDevUser(username) {
    const currentDev = sessionStorage.getItem('devUsername');
    if (currentDev === username) {
        alert('Tidak bisa menghapus akun sendiri!');
        return false;
    }
    devCredentials = devCredentials.filter(d => d.username !== username);
    saveDevCredentials();
    return true;
}

// Export
window.loginDeveloper = loginDeveloper;
window.isDevLoggedIn = isDevLoggedIn;
window.logout = logout;
window.addDevUser = addDevUser;
window.removeDevUser = removeDevUser;
