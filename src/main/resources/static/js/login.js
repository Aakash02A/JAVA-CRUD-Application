const loginForm = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');
const infoBox = document.getElementById('infoBox');

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
    infoBox.classList.add('hidden');
}

function showInfo(message) {
    infoBox.textContent = message;
    infoBox.classList.remove('hidden');
    errorBox.classList.add('hidden');
}

// If the user just registered, show a friendly message.
const params = new URLSearchParams(window.location.search);
if (params.get('registered') === 'true') {
    showInfo('Account created successfully. Please log in.');
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // send/receive the session cookie
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message || 'Login failed. Please check your credentials.');
            return;
        }

        // Login succeeded -> go to the dashboard.
        window.location.href = 'dashboard.html';
    } catch (err) {
        showError('Could not reach the server. Is the backend running?');
    }
});
