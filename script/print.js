document.addEventListener('DOMContentLoaded', function () {
    const expandButton = document.getElementById('expandButton');
    const saveButton = document.getElementById('saveButton');
    const crimeChart = document.getElementById('crimeChart');
    const chartContainer = document.getElementById('chartContainer');

    // Expand functionality
    expandButton.addEventListener('click', function () {
        if (crimeChart.style.width === '100%') {
            crimeChart.style.width = '900px'; // or whatever your default size is
            crimeChart.style.height = '400px'; // set to your desired height
            expandButton.textContent = 'Expand for Print'; // Reset button text
        } else {
            crimeChart.style.width = '100%'; // Expand to full width
            crimeChart.style.height = '400px'; // Set to your desired height
            expandButton.textContent = 'Collapse'; // Change button text
        }

        // Ensure Chart.js updates properly
        setTimeout(() => {
            if (window.myChart) {
                window.myChart.resize(); // Force Chart.js to re-render
            }
        }, 300); // Delay allows the DOM to update first
        
    });

    // Save as PDF functionality
    saveButton.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;

        // Use html2canvas to capture the chart
        html2canvas(chartContainer, {
            scale: 2 // Increase scale for better quality
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // Create a landscape PDF

            // Set desired dimensions for the PDF
            const imgWidth = 290; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // x, y, width, height

            // Save the PDF
            pdf.save('crimeChart.pdf');
        });
    });
});