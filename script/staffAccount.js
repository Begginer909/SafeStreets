// Fetch data from the backend API
fetch('http://localhost:3000/userAccount/Staff')
.then(response => response.json())
.then(data => {
    const tableBody = document.getElementById('taskTable').querySelector('tbody');
    data.forEach(acc => {
        const row = document.createElement('tr');
        row.dataset.account = JSON.stringify(acc); // Add account data as a data attribute
        row.innerHTML = `
            <td class="text-center">${acc.userID}</td>
            <td class="text-center">${acc.username}</td>
            <td class="text-center">${acc.firstName} ${acc.lastName}</td>
            <td class="text-center">${acc.contact}</td>
            <td class="text-center">${acc.role}</td>
            
            <td class="text-center">
                <button class="btn btn-warning btn-sm" onclick="editTask(this)">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${acc.userID})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
})
.catch(error => console.error('Error fetching tasks:', error));

function editTask(buttonElement) {
const row = buttonElement.closest('tr');
const account = JSON.parse(row.dataset.account); // Parse the account data

const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
editTaskModal.show();

// Populate the form fields with the account data
document.getElementById('editAccountId').value = account.userID;
document.getElementById('editUsername').value = account.username;
document.getElementById('editFirstName').value = account.firstName;
document.getElementById('editLastName').value = account.lastName;
document.getElementById('editContact').value = account.contact;
document.getElementById('editRole').value = account.role;
}

function closeEditModal() {
const modalElement = document.getElementById('editTaskModal');
const editTaskModal = bootstrap.Modal.getInstance(modalElement); // Get the modal instance

editTaskModal.hide();
}

document.getElementById('editTaskForm').addEventListener('submit', async function (e) {
e.preventDefault();

const id = document.getElementById('editAccountId').value;
const updatedData = {
    username: document.getElementById('editUsername').value,
    firstName: document.getElementById('editFirstName').value,
    lastName: document.getElementById('editLastName').value,
    contact: document.getElementById('editContact').value,
    role: document.getElementById('editRole').value,
};

// Include the password only if it's provided
const password = document.getElementById('editPassword').value;
if (password) {
    updatedData.password = password; // The backend will hash this
}

try {
    const response = await fetch(`http://localhost:3000/updateAccount/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (response.ok) {
        alert('Account updated successfully');

        closeEditModal();
        // Reload the data or update the UI

        location.reload();

        // Update the UI
        const rows = document.querySelectorAll('#taskTable tbody tr');
        rows.forEach((row) => {
            const account = JSON.parse(row.dataset.account);
            if (account.userID === parseInt(id, 10)) {
                // Update the row data
                account.username = updatedData.username;
                account.firstName = updatedData.firstName;
                account.lastName = updatedData.lastName;
                account.contact = updatedData.contact;
                account.role = updatedData.role;

                row.dataset.account = JSON.stringify(account); // Update the row dataset
                row.innerHTML = `
                    <td class="text-center">${account.userID}</td>
                    <td class="text-center">${account.username}</td>
                    <td class="text-center">${account.firstName} ${account.lastName}</td>
                    <td class="text-center">${account.contact}</td>
                    <td class="text-center">${account.role}</td>
                    <td class="text-center">
                        <button class="btn btn-warning btn-sm" onclick="editTask(this)">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTask(${account.userID})">Delete</button>
                    </td>
                `;
            }
        });
    } else {
        throw new Error('Failed to update account');
    }
} catch (err) {
    console.error(err);
    alert('An error occurred while updating the account');
}
});

/// Delete Task Function
    function deleteTask(id) {
        if (confirm(`Are you sure you want to delete Task ID ${id}?`)) {
        // Send DELETE request to server
        fetch(`http://localhost:3000/delete/${id}`, { method: 'DELETE' })  // Use DELETE method
        .then(response => response.json())
        .then(result => {
            alert(result.message); // Show success message from backend
            // Reload or update the table after deletion
            location.reload();
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            alert('An error occurred while deleting the task');
        });
    }
}
