// Add form validation
document.getElementById('createReportForm').addEventListener('submit', function(event) {
    // Prevent form submission if there are validation errors
    if (!this.checkValidity()) {
        event.preventDefault(); // Prevent the form from submitting
        event.stopPropagation(); // Stop the event from bubbling up
        alert("Please fill in all required fields correctly."); // Alert the user
    } else {
        // If the form is valid, you can proceed with form submission or further processing
        // For example, you can send the data to the server here
        alert("Form submitted successfully!"); // Optional success message
    }
    this.classList.add('was-validated'); // Add Bootstrap validation class
});
