document.addEventListener('DOMContentLoaded', function () {
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // month is 0-based, so add 1
    const currentDay = today.getDate();

    // Populate the year dropdown (you can adjust the range as needed)
    for (let year = 1900; year <= new Date().getFullYear(); year++) {
        let option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.add(option);
    }

    // Populate the month dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.forEach((month, index) => {
        let option = document.createElement('option');
        option.value = index + 1; // month value is 1-based
        option.text = month;
        monthSelect.add(option);
    });

    // Function to populate days based on selected month and year
    function populateDays(year, month) {

        // Get the number of days in the selected month
        let daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            let option = document.createElement('option');
            option.value = day;
            option.text = day;
            daySelect.add(option);
        }

        // Re-select the previously selected day if it's still valid
        if (daySelect.value > daysInMonth) {
            daySelect.value = daysInMonth; // Set to the last day of the month if the current day is invalid
        } else if (daySelect.value < 1) {
            daySelect.value = 1; // Ensure at least the first day is selected
        }
    }

    // Initial population of days
    populateDays(currentYear, currentMonth);

    // Set default selected values to today's date
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;
    daySelect.value = currentDay;

    // Event listeners to update days when month or year changes
    yearSelect.addEventListener('change', () => {
        populateDays(yearSelect.value, monthSelect.value);
    });

    monthSelect.addEventListener('change', () => {
        populateDays(yearSelect.value, monthSelect.value);
    });
});

document.querySelector('form').addEventListener('submit', async function (e) {
e.preventDefault(); // Prevent form from reloading the page

// Collect form data
const formData = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    contact: document.getElementById('contact').value.trim(),
    password: document.getElementById('password').value.trim(),
    birthday: `${String(document.getElementById('year').value)}-${String(document.getElementById('month').value).padStart(2, '0')}-${String(document.getElementById('day').value).padStart(2, '0')}`,
    gender: document.querySelector('input[name="flexRadioDefault"]:checked')?.id || '',
    username: document.getElementById('username').value.trim(),
};

// Validate contact number
if (!/^\d{11}$/.test(formData.contact)) {
    alert('Contact number must be 11 digits and contain only numbers.');
    return;
}

// Validate username
try {
    const usernameCheckResponse = await fetch(`https://safestreets-production.up.railway.app/check-username?username=${formData.username}`);
    const usernameCheckResult = await usernameCheckResponse.json();

    if (usernameCheckResult.exists) {
        alert('The username is already taken. Please choose another one.');
        return;
    }
} catch (error) {
    console.error('Error checking username:', error);
    alert('An error occurred while checking the username. Please try again.');
    return;
}

try {
    // Send data to the backend
    const response = await fetch('https://safestreets-production.up.railway.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        window.location.href = '../../pages/public/index.html'; // Redirect after success
    } else {
        alert('Error: ' + result.error);
    }
} catch (error) {
    console.error('Error:', error);
    alert('An error occurred while registering.');
}
});


document.getElementById('contact').addEventListener('input', function () {
    const contact = this.value.trim();
    const contactFeedback = document.getElementById('contactFeedback');

    if (!/^\d*$/.test(contact)) {
        this.classList.add('is-invalid');
        contactFeedback.textContent = 'Contact number must contain only digits.';
    } else if (contact.length > 11) {
        this.classList.add('is-invalid');
        contactFeedback.textContent = 'Contact number must be exactly 11 digits.';
    } else {
        this.classList.remove('is-invalid');
        contactFeedback.textContent = '';
    }
});