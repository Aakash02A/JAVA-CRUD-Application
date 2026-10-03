const registerForm = document.getElementById('registerForm');
const errorBox = document.getElementById('errorBox');

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // If validation failed, the backend returns a { field: message } map.
            // Otherwise it's a single { message } object.
            const errorMessage = data.message || Object.values(data)[0] || 'Registration failed.';
            showError(errorMessage);
            return;
        }

        // Registration succeeded -> send them to login with a success flag.
        window.location.href = 'login.html?registered=true';
    } catch (err) {
        showError('Could not reach the server. Is the backend running?');
    }
});
