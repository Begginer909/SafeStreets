    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const response = await fetch('http://localhost:3000/protected', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
            });

            if (!response.ok) {
            throw new Error('Failed to fetch user information.');
            }

            const data = await response.json();
            populateFields(data.user); // Populate the fields with user data
        } catch (error) {
            console.error('Error:', error);
        }
    });

    function populateFields(user) {
        
        // Store accID for later use
        document.getElementById('accID').value = user.accID; // Make sure the hidden input exists
    }

    document.getElementById('createReportForm').addEventListener('submit', async (e) => {
        // Prevent form submission if there are validation errors
        if (!this.checkValidity()) {
            e.preventDefault(); // Prevent the form from submitting
            e.stopPropagation(); // Stop the event from bubbling up
            alert("Please fill in all required fields correctly."); // Alert the user
        } else {
            alert("Report created successfully!");

            const data = {
                accID: document.getElementById('accID').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                date: document.getElementById('date').value, 
                crimeType: document.getElementById('crimeType').value,
                description: document.getElementById('describeID').value,
                street: document.getElementById('street').value,
                area: document.getElementById('circleID').value
            };

            const response = await fetch('http://localhost:3000/staff/createReport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        
            const result = response.json();
            alert(result.message);
        }
        this.classList.add('was-validated'); // Add Bootstrap validation class

    });

    // Reset the form and feedback when the Create Report modal is closed
    const createReportModal = document.getElementById('createReportModal');
    createReportModal.addEventListener('hidden.bs.modal', function () {
        const form = document.getElementById('createReportForm');
        form.reset(); // Reset the form fields
        form.classList.remove('was-validated'); // Remove validation feedback
    });




