var listItems = document.getElementsByClassName("selectedItem");

function itemSelected() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
}

for(var i = 0; i < listItems.length; i++){
    listItems[i].addEventListener("click", itemSelected);
}

const navbar = document.getElementById('collapseWidthExample');
const contentColumn = document.getElementById('content');
const navbarCol = document.getElementById('navbarCol');

const ctx = document.getElementById('myChart');
        
const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Numbers of Report',
                data: [12, 19, 3, 5, 2, 3, 5],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
        onClick: (event) => {
            const activePoints = myChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            if (activePoints.length) {
                const clickedIndex = activePoints[0].index;
                const label = myChart.data.labels[clickedIndex];
                const value = myChart.data.datasets[0].data[clickedIndex];
                alert(`Clicked on ${label}: ${value}`);
            }
        }
    }
});

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