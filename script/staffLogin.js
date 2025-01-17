document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
    const response = await fetch('http://localhost:3000/login/Staff', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to login'}`);
        return;
    }

    const data = await response.json();
    alert('Login successful! Redirecting...');
    window.location.href = data.redirectUrl; // Redirect to the appropriate page
    } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred while logging in. Please try again.');
    }
});