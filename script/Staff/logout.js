document.getElementById("confirmLogout").addEventListener("click", function () {
    fetch('safestreets-production.up.railway.app/logout', {
        method: 'POST',
        credentials: 'include' // Ensures cookies are sent with the request
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show logout message
        window.location.href = "staffLogin.html"; // Redirect to login page
    })
    .catch(error => console.error('Logout failed:', error));
});
