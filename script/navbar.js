document.addEventListener("DOMContentLoaded", function () {
    let navbar = document.getElementById("navbarCol");
    let content = document.getElementById("content");
    let toggleButton = document.getElementById("toggleNavbar");
    let logo = document.getElementById("navbarLogo");

    content.style.marginLeft = "80px";
    content.style.width = "calc(100% - 80px)";

    function toggleNavbar() {
        navbar.classList.toggle("expanded");

        if (navbar.classList.contains("expanded")) {
            content.style.marginLeft = "250px";
            content.style.width = "calc(100% - 250px)";
            toggleButton.style.display = "none"; // Hide button
            logo.style.display = "block"; // Show logo
        } else {
            content.style.marginLeft = "80px";
            content.style.width = "calc(100% - 80px)";
            toggleButton.style.display = "block"; // Show button
            logo.style.display = "none"; // Hide logo
        }
    }

    // Click events for both toggle button and logo
    toggleButton.addEventListener("click", toggleNavbar);
    logo.addEventListener("click", toggleNavbar);
});
