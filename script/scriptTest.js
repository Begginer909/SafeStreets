document.addEventListener('DOMContentLoaded', function () {
    // Get all the nav items
    const navItems = document.querySelectorAll('.nav-item');

    // Loop through all the items and add the click event listener
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove the 'active' class from all items
            navItems.forEach(i => i.classList.remove('active'));

            // Add the 'active' class to the clicked item
            this.classList.add('active');
        });
    });
});
