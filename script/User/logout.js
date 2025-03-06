document.getElementById("confirmLogout").addEventListener("click", function () {
    fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include' // Ensures cookies are sent with the request
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show logout message
        window.location.href = "../../pages/public/index.html"; // Redirect to login page
    })
    .catch(error => console.error('Logout failed:', error));
});
