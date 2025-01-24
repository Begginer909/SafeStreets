document.addEventListener('DOMContentLoaded', function() {
    const crimeTypeFilter = document.getElementById('crimeTypeFilter');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('crimeReportsTableBody'); // Ensure this ID matches

    document.getElementById('openCrimeReportsModal').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor click behavior

        // Fetch data from the server
        fetch('http://localhost:3000/api/crime-reports') // Adjust the endpoint as necessary
            .then(response => response.json())
            .then(data => {
                populateTable(data); // Populate the table with initial data
    
                // Add event listeners for filtering
                crimeTypeFilter.addEventListener('change', () => filterTable(data));
                searchInput.addEventListener('input', () => filterTable(data));
    
                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById('crimeReportsModal'));
                modal.show(); // Show the modal after populating the table
            })
            .catch(error => {
                console.error('Error fetching crime reports:', error);
            });
    });

    function fetchDataAndPopulateTable(){
        // Fetch data from the server
        fetch('http://localhost:3000/api/crime-reports') // Adjust the endpoint as necessary
        .then(response => response.json())
        .then(data => {
            populateTable(data); // Populate the table with initial data

            // Add event listeners for filtering
            crimeTypeFilter.addEventListener('change', () => filterTable(data));
            searchInput.addEventListener('input', () => filterTable(data));

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('crimeReportsModal'));
            modal.show(); // Show the modal after populating the table
        })
        .catch(error => {
            console.error('Error fetching crime reports:', error);
        });
    }

    function populateTable(data) {
        tableBody.innerHTML = ''; // Clear existing data
    
        data.forEach(report => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = report.reportID;
            row.insertCell(1).innerText = report.firstName;
            row.insertCell(2).innerText = report.lastName;
            row.insertCell(3).innerText = report.crimeType;
            row.insertCell(4).innerText = report.description;
            row.insertCell(5).innerText = report.street;
            row.insertCell(6).innerText = new Date(report.date).toLocaleString(); // Format date
            row.insertCell(7).innerText = report.circleID;
            row.insertCell(8).innerHTML = report.status;
    
            // Create action buttons
            const actionsCell = row.insertCell(9); // New Actions Cell
            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.className = 'btn btn-warning btn-sm me-2'; // Bootstrap classes for styling
            editButton.onclick = () => editReport(report); // Call edit function
    
            const deleteButton = document.createElement ('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.onclick = () => deleteReport(report); // Call delete function
    
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }


    function filterTable(data) {
        const selectedCrimeType = crimeTypeFilter.value.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase();

        const filteredData = data.filter(report => {
            const matchesCrimeType = selectedCrimeType ? report.crimeType.toLowerCase() === selectedCrimeType : true;
            const matchesSearchTerm = report.firstName.toLowerCase().includes(searchTerm) || 
                                       report.lastName.toLowerCase().includes(searchTerm) || 
                                       report.description.toLowerCase().includes(searchTerm);
            return matchesCrimeType && matchesSearchTerm;
        });

        populateTable(filteredData); // Update the table with filtered data
    }

    function editReport(report) {
        // Populate the edit modal with the report data
        document.getElementById('editFirstName').value = report.firstName;
        document.getElementById('editLastName').value = report.lastName;
        document.getElementById('editCrimeType').value = report.crimeType;
        document.getElementById('editDescription').value = report.description;
        document.getElementById('editStreet').value = report.street;
        document.getElementById('editCircleID').value = report.circleID;
        document.getElementById('status').value = report.status;
        document.getElementById('editReportID').value = report.reportID; // Set the report ID
    
        // Show the edit modal
        const editModal = new bootstrap.Modal(document.getElementById('editReportModal'));
        editModal.show();
    
        // Handle the save button click
        document.getElementById('saveEditButton').onclick = () => {
            const updatedReport = {
                reportID: document.getElementById('editReportID').value,
                firstName: document.getElementById('editFirstName').value,
                lastName: document.getElementById('editLastName').value,
                crimeType: document.getElementById('editCrimeType').value,
                description: document.getElementById('editDescription').value,
                street: document.getElementById('editStreet').value,
                circleID: document.getElementById('editCircleID').value,
                status: document.getElementById('status').value,
                source: report.source,
            };

            // Make a PUT request to update the report
            fetch(`http://localhost:3000/api/crime-reports-update/${updatedReport.reportID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedReport)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Report updated successfully');
                    fetchDataAndPopulateTable(); // Refresh the table data
                    editModal.hide(); // Hide the edit modal
                } else {
                    console.error('Error updating report');
                }   
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };
    }

    function deleteReport(report) {
        if (confirm('Are you sure you want to delete this report?')) {
            const reportID = report.reportID;
            const source = report.source; // Get the source of the report
    
            // Make a DELETE request to your server to delete the report
            fetch(`http://localhost:3000/api/crime-reports/${reportID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ source }) // Send the source to the server
            })
            .then(response => {
                if (response.ok) {
                    console.log('Report deleted successfully');
                    // Optionally, refresh the table data
                    fetchDataAndPopulateTable(); // Function to fetch data and repopulate the table
                } else {
                    console.error('Error deleting report');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
});
