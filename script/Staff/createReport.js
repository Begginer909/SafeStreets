document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://safestreets-production.up.railway.app/protected', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user information.');
        }

        const data = await response.json();
        populateFields(data.user);
    } catch (error) {
        console.error('Error:', error);
    }
});

function populateFields(user) {
    document.getElementById('accID').value = user.accID;
}

document.getElementById('createReportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        e.stopPropagation();
        alert("Please fill in all required fields correctly.");
        form.classList.add('was-validated');
        return;
    }

    const data = {
        accID: document.getElementById('accID').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        date: document.getElementById('date').value,
        crimeType: document.getElementById('crimeType').value,
        description: document.getElementById('describeID').value,
        street: document.getElementById('street').value,
        area: document.getElementById('circleID').value,
    };

    try {
        const response = await fetch('https://safestreets-production.up.railway.app/staff/createReport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Report submitted successfully!");

            // Close the modal programmatically
            const modalElement = document.getElementById('createReportModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
                // Reset the form after the modal is closed
                modalInstance._element.addEventListener('hidden.bs.modal', () => {
                    form.reset();
                    form.classList.remove('was-validated');
                });
            }
        } else {
            alert(`Failed to submit: ${result.message || 'Unknown error occurred.'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the form. Please try again.');
    }
});

// Reset the form and feedback when the Create Report modal is closed
const createReportModal = document.getElementById('createReportModal');
createReportModal.addEventListener('hidden.bs.modal', () => {
    const form = document.getElementById('createReportForm');
    form.reset();
    form.classList.remove('was-validated');
});