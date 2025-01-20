function fetchData() {
    const category1 = document.getElementById('category1').value; // e.g., "All Areas"
    const crimeTypeSelect = document.getElementById('category2');
    const selectedCrimeTypes = Array.from(crimeTypeSelect.selectedOptions).map(opt => opt.value); // Multiple crime types
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    fetch('http://localhost:3000/getCrimeData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category1, selectedCrimeTypes, startDate, endDate })
    })
        .then(response => response.json())
        .then(data => {
            updateChart(data);
            updateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(row => {
        const tableRow = `
            <tr>
                <td>${row.circleID}</td>
                <td>${row.count}</td>
                <td>${row.percentage.toFixed(2)}%</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', tableRow);
    });
}

