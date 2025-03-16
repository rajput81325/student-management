document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = '/';
        } else {
            errorMessage.textContent = data.message;
            errorMessage.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
