// Initialize Socket.IO
const socket1 = io('https://safestreets-production.up.railway.app');

// Listen for new report notifications
socket1.on('new_notification', () => {
const reportCount = document.getElementById('report-count');
const currentCount = parseInt(reportCount.textContent, 10);
reportCount.textContent = currentCount + 1;
reportCount.classList.add('visible'); // Show the badge if not already visible
});

// Reset count when modal opens
document.getElementById('notification-card').addEventListener('click', () => {
document.getElementById('report-count').textContent = 0;
document.getElementById('report-count').classList.remove('visible');
});

// Reset count when modal opens
document.getElementById('notification-card').addEventListener('click', () => {
    document.getElementById('report-count').textContent = 0;
    document.getElementById('report-count').classList.remove('visible');
});

// Load notifications into modal
document.getElementById('notification-card').addEventListener('click', async () => {
    const response = await fetch('https://safestreets-production.up.railway.app/populatenotifications');
    const notifications = await response.json();
    const tbody = document.querySelector('#notification-table tbody');
    tbody.innerHTML = ''; // Clear previous data

    notifications.forEach((notification) => {
        const row = `
            <tr>
                <td>${notification.accID}</td>
                <td>${notification.firstName} ${notification.lastName}</td>
                <td>${notification.contact}</td>
                <td>${notification.crimeType}</td>
                <td>${notification.description}</td>
                <td>${notification.street}</td>
                <td>${notification.imagePath}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-view" data-id="${notification.notificationID}">View</button>
                    <button class="btn btn-success btn-send" data-id="${notification.notificationID}">Send</button>
                    <button class="btn btn-danger btn-delete" data-id="${notification.notificationID}">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
});

document.getElementById("crimeImage").addEventListener("click", function() {
    const newTab = window.open();
    newTab.document.write(`<img src="${this.src}" style="width:100%">`);
});

// Map and modal interaction
let map1; // Declare a global variable for the map
const mapContainer = document.getElementById('map1');
const modalElement = new bootstrap.Modal(document.getElementById('notification-modal'));
let notificationToDelete = null; // Variable to store the notification ID to delete
const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));

// Get modal element
var modal = document.getElementById("myModal");

// Close button
const closeButton = document.querySelector('.custom-close');

// Function to open the modal and initialize the map
function openModal(latitude, longitude, crimeType, description) {
    modal.style.display = "block";

    // Use a timeout to ensure the modal is fully rendered
    setTimeout(() => {
        map1 = L.map('map1').setView([latitude, longitude], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map1);
        L.marker([latitude, longitude])
            .addTo(map1)
            .bindPopup(`<b>${crimeType}</b><br>${description}`)
            .openPopup();

        setTimeout(() => {
                map1.invalidateSize(); // Refresh map rendering after modal shows
            }, 300);
    }, 0);
}

// When the user clicks the close button, close the modal
closeButton.addEventListener('click', () => {
    modal.style.display = "none";

    // Clear the map instance to avoid duplication
    if (map1) {
        map1.remove();
        map1 = null;
    }
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-view')) {
        const notificationID = e.target.dataset.id;

        // Fetch notification data
        const response = await fetch('https://safestreets-production.up.railway.app/notifications/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationID }),
        });

        const data = await response.json();

        // Hide modal
        modalElement.hide();

        if (data.imagePath) {
            document.getElementById('crimeImage').src = `https://safestreets-production.up.railway.app/uploads/${data.imagePath}`;
            console.log(data.imagePath);
        } else {
            console.log("No image found.");
        }

        // Clear previous map instance
        if (map1) {
            map1.remove();
        }

        openModal(data.latitude, data.longitude, data.crimeType, data.description);

    }
    if (e.target.classList.contains('btn-send')) {
        // Example function to handle report submission
        async function sendReport(event) {
            // Show the confirmation modal
            const reportModal = new bootstrap.Modal(document.getElementById('reportConfirmationModal'));
            reportModal.show();
    
            // Add event listener for the confirm button
            const confirmButton = document.getElementById('confirmReportButton');
            confirmButton.onclick = async function () {
                const notificationID = event.target.dataset.id;
    
                try {
                    await fetch('https://safestreets-production.up.railway.app/notifications/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notificationID }),
                    });
    
                    alert('Incident confirmed and users notified!');
                    event.target.closest('tr').remove(); // Remove row from the table
                } catch (error) {
                    console.error('Error sending report:', error);
                    alert('Failed to send the report. Please try again.');
                }
    
                // Close the modal
                reportModal.hide();
            };
        }
    
        // Trigger report submission
        sendReport(e);
    }
    
    if (e.target.classList.contains('btn-delete')) {
        // Store the notification ID and show the confirmation modal
        notificationToDelete = e.target.dataset.id;
        deleteConfirmationModal.show();
    }
});



// Handle delete confirmation
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    if (notificationToDelete) {
        try {
            // Send DELETE request to server
            const response = await fetch(`https://safestreets-production.up.railway.app/notifications/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationID: notificationToDelete }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete notification.');
            }

            // Remove the deleted row from the table
            document.querySelector(`[data-id="${notificationToDelete}"]`).closest('tr').remove();
            alert('Notification deleted successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the notification.');
        } finally {
            notificationToDelete = null; // Reset notification ID
            deleteConfirmationModal.hide(); // Hide the modal
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString(); // Get the current time in HH:MM:SS format
        document.getElementById('notif').textContent = timeString;
    }

    // Update the time immediately when the page loads
    updateTime();

    // Continue updating the time every 1000ms (1 second)
    setInterval(updateTime, 1000);
});

