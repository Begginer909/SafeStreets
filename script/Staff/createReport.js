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

console.log (test);
function populateFields(user) {
    
    // Store accID for later use
    document.getElementById('accID').value = user.accID; // Make sure the hidden input exists
}

document.getElementById('createReportForm').addEventListener('submit', async (e) => {
    e.preventDefault();

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

    if(response.ok){
        alert("success");
    }

    const result = await response.json();
    alert(result.message);
});





