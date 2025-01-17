// Initialize the map
var map = L.map('map', {
    center: [14.358131750283409, 121.05873048305513],
    zoom: 16,
    minZoom: 5,
});

// Add a tile layer (you can use different tile providers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 5,
}).addTo(map);

// Add an event listener for map clicks
map.on('click', function(e) {
    // e.latlng contains the latitude and longitude of the clicked point
    const { lat, lng } = e.latlng;

    // Log the latitude and longitude to the console
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
});

var NW = {lat: 14.362964938852976, lng: 121.05478763580324}
var SE = {lat: 14.348164116301717, lng: 121.06392860412599}
var W = {lng: 121.05478763580324} // Westernmost latitude
var E = {lng: 121.06392860412599};   // Southernmost latitude

var north = NW.lat;
var south = SE.lat;
var west = W.lng;
var east = E.lng;

// Create a bounds object from these coordinates
var bounds = L.latLngBounds(
L.latLng(south, west), // Southwest corner (South, West)
L.latLng(north, east)  // Northeast corner (North, East)
);

// Set the bounds on the map
map.setMaxBounds(bounds);

// Prevent dragging outside the bounds
map.on('drag', function () {
map.panInsideBounds(bounds, { animate: false });
});



// Connect to the Socket.IO server
const socket = io('http://localhost:3000');

// Listen for new crime reports
socket.on('incident_confirmed', (report) => {
    console.log('New report received:', report);

    // Display a real-time notification (e.g., an alert or a custom notification UI)
    alert(`New report: ${report.crimeType} reported at ${report.street}`);

    // Format the `createdAt` timestamp
    const reportDate = new Date(report.createdAt); // Convert to a Date object

    console.log(report.createdAt);
    
    const formattedDate = reportDate.toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'short', // e.g., "Jan"
        day: '2-digit', // e.g., "15"
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // AM/PM format
    });

    // Add a new marker to the map for the reported crime
    const marker = L.marker([report.latitude, report.longitude]).addTo(map);
    marker.bindPopup(`
        <b>Crime Type:</b> ${report.crimeType}<br>
        <b>Description:</b> ${report.description}<br>
        <b>Reported at:</b> ${report.street}<br>
        <b>Reported on:<b> ${formattedDate}
    `).openPopup();
});

//CIRCLE OVERLAY 

// Circle definitions - cicle counting start from the top 
const circles = [
    { id: 1, lat: 14.358134835918086, lng: 121.05912744998933, radius: 70, color: 'green' }, // circle 5
    { id: 2, lat: 14.358368694422813, lng: 121.05800628662111, radius: 70, color: 'green' }, //circle 4
    { id: 3, lat: 14.359368517975929, lng: 121.05887129902841, radius: 70, color: 'green'}, //circle 3
    { id: 4, lat: 14.35726371083779, lng: 121.0584729909897, radius: 70, color: 'green'}, //circle 6
    { id: 5, lat: 14.356084016287031, lng: 121.05936348438264, radius: 100, color: 'green'}, //circle 7
    { id: 6, lat: 14.354467772690725, lng: 121.0602378845215, radius: 100, color: 'green'}, // circle 8
    { id: 7, lat: 14.361260074803814, lng: 121.05718016624452, radius: 100, color: 'green'}, //circle 1
    { id: 8, lat: 14.353574221433659, lng: 121.0618042945862, radius: 70, color: 'green'}, // circle 9 
    { id: 9, lat: 14.351988816915645, lng: 121.0623461008072, radius: 100, color: 'green'}, // circle 10
    { id: 10, lat: 14.349915528714972, lng: 121.06334924697877, radius: 100, color: 'green'}, // circle 11
    { id: 11, lat: 14.359810491668052, lng: 121.05781316757204, radius: 70, color:'green'}, //circle 2
  ];

// Create Leaflet circle objects
const leafletCircles = circles.map(circle => {
    return L.circle([circle.lat, circle.lng], {
      radius: circle.radius,
      color: circle.color,
    }).addTo(map);
});


  // Listen for the 'circle-data' event from the server
socket.on('circle-data', (data) => {
    console.log('Received circle data:', data); // Add this
      data.forEach((circleData, index) => {
        const count = circleData.count;
        let newColor = 'green';
        if (count > 2 && count <= 20) newColor = 'yellow';
        else if (count > 20) newColor = 'red';

        console.log(`Circle ${index} new color: ${newColor}`);

        // Update circle color based on report count
        leafletCircles[index].setStyle({ color: newColor });
      });
});


/*
//CHART JS
const chartContext = document.getElementById('crimeChart').getContext('2d');
let crimeChart; // For storing the chart instance
circleId = circles.id;

// Function to fetch and update the chart
async function fetchAndUpdateChartData(circleId) {
    try {
        const response = await fetch(`http://localhost:3000/api/circle-data/${circleId}`);
        const data = await response.json();

        // Data for the chart
        const labels = data.map(item => item.crimeType);
        const values = data.map(item => item.count);
        const percentages = data.map(item => parseFloat(item.percentage).toFixed(2));

        // Update or create chart
        if (crimeChart) {
            crimeChart.data.labels = labels;
            crimeChart.data.datasets[0].data = values;
            crimeChart.update();
        } else {
            crimeChart = new Chart(chartContext, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Crime Count',
                        data: values,
                        backgroundColor: '#36A2EB',
                    }]
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    const percentage = percentages[tooltipItem.dataIndex];
                                    const value = tooltipItem.raw;
                                    return `Value: ${value}, Percentage: ${percentage}%`;
                                }
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// Add click event listeners to circles
leafletCircles.forEach(circle => {
    circle.on('click', () => {
        const circleId = circles.find(c => c.lat === circle.getLatLng().lat && c.lng === circle.getLatLng().lng).id;
        fetchAndUpdateChartData(circleId);
    });
});

// Add event listener to dropdown
document.getElementById('circleSelect').addEventListener('change', (event) => {
    const selectedCircleId = event.target.value;
    fetchAndUpdateChartData(selectedCircleId);
});

*/
