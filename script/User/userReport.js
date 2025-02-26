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
    // Example: Fill fields with the user's information
    document.getElementById('name').value = (user.Fname || '') + ' ' + (user.Lname || '');
    document.getElementById('contact').value = user.contact || '';

    // Store accID for later use
    document.getElementById('accID').value = user.accID; // Make sure the hidden input exists
}


async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            // Set latitude and longitude values
            document.getElementById('latitude').value = position.coords.latitude;
            document.getElementById('longitude').value = position.coords.longitude;

            // Get the street address
            //const street = await getStreetAddress(position.coords.latitude, position.coords.longitude);
            //console.log('Street:', street);

            // Set the street address in a global variable or DOM if needed
            //document.getElementById('street').value = street; // Set it to an input field (optional)
        }, (error) => {
            alert("Unable to fetch location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

//FOR TESTING ONLY WHEN USER LOCATION IS NOT SAKOP NG BRGY
function getStreet(){
    const lat = document.getElementById('latitude').value;
    const long = document.getElementById('longitude').value;

    if(!lat && !long){
        alert("Walang lat and long");
    }
    else{
        getStreetAddress(lat, long).then(street => {
            document.getElementById('street').value = street;
        });
    }
    
}

// Define getStreetAddress function
function getStreetAddress(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data && data.address) {
                 // Combine road, street, and city into one string
                const road = data.address.road || '';
                const street = data.address.suburb || ''; // Sometimes the street name is in 'suburb'
                const city = data.address.city || data.address.town || data.address.village || ''; // Handle different city variations

                // Concatenate the address components into one string
                return `${road}, ${street}, ${city}`.trim();
            } else {
                console.error('No address found for these coordinates.');
                return 'Street not found';
            }
        })
        .catch((error) => {
            console.error('Error fetching street address:', error);
            return 'Street not found';
        });
}

// Call getLocation when the page loads to fetch the user's location
document.addEventListener('DOMContentLoaded', getLocation);

// Button for getting the location
document.getElementById('getLocation').addEventListener('click', getStreet);

// Handle form submission
document.getElementById('crime-report-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('crime-report-form');
    const formData = new FormData(form);

    try {
        const response = await fetch('http://localhost:3000/notifications', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            alert('Crime report submitted successfully!', data.imageUrl);
            
            // Close the modal programmatically
            const modalElement = document.getElementById('staticBackdrop');
            const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
            bootstrapModal.hide();

            document.getElementById('crime-type').value = "";
            document.getElementById('describeID').value = "";
            document.getElementById('image').value = "";

            // Optionally, fetch the location again for updated latitude and longitude
            getLocation();

             // Optional: Notify staff via WebSocket or other real-time mechanism
        } else {
            alert('Failed to submit report.');
        }
    } catch (error) {
        console.error('Error submitting report:', error);
    }
});