var listItems = document.getElementsByClassName("selectedItem");

const navbar = document.getElementById('collapseWidthExample');
const contentColumn = document.getElementById('content');
const navbarCol = document.getElementById('navbarCol');


navbar.addEventListener('show.bs.collapse', function () {
    // When the navbar is expanded, shrink the content to 75% width (or col-9 equivalent)
    contentColumn.style.width = '80%';
    navbarCol.style.width = '20%'; // Adjust the navbar column width accordingly


});

navbar.addEventListener('hide.bs.collapse', function () {
    // When the navbar is collapsed, expand the content to full width (col-12 equivalent)
    contentColumn.style.width = '92%';
    navbarCol.style.width = '8%';  // Hide the navbar when collapsed
});

