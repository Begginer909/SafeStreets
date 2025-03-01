// Initialize the map
var map = L.map('map', {
    center: [14.358131750283409, 121.05873048305513],
    zoom: 15,
    minZoom: 5,
});

var labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    minZoom: 5,
});

// Add a tile layer (you can use different tile providers)
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 5,
}).addTo(map);

var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    minZoom: 5,
});

var baseMaps = {
    "OpenStreetMap": osmLayer,
    "Satellite View": satelliteLayer
};

var labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri',
    maxZoom: 19,
    minZoom: 5
});

var osmLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors & CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 5
});

var overlayMaps = {
    "Place Names & Roads (Esri)": labels,
    "Place Names & Roads (OSM)": osmLabels
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Add an event listener for map clicks
map.on('click', function(e) {
    // e.latlng contains the latitude and longitude of the clicked point
    const { lat, lng } = e.latlng;

    // Log the latitude and longitude to the console
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
});

var NW = {lat: 14.362964938852976, lng: 121.05478763580324};
var SE = {lat: 14.348164116301717, lng: 121.06392860412599};

var bounds = L.latLngBounds(
    L.latLng(SE.lat, NW.lng), // Southwest
    L.latLng(NW.lat, SE.lng)  // Northeast
);

// Set the bounds on the map
map.setMaxBounds(bounds);


// Connect to the Socket.IO server
const socketUser = io('http://localhost:3000');

// Function to get URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}

// Get report details from URL parameters
const params = getUrlParams();

console.log("Params: " + params);
if (params.reportId && params.description && params.location) {
    const location = JSON.parse(params.location); // Parse the location back to an object
    const marker = L.marker([location.lat, location.lng]).addTo(map)
        .bindPopup(`
            <div>
                <b>Report ID: ${params.reportId}</b><br>
                <b>Description: ${params.description}</b>
            </div>
        `)
        .openPopup();
}

// Listen for new crime reports
socketUser.on('incident_confirmed', (report) => {
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
    
    const crimeType = report.crimeType.toLowerCase(); // Normalize for consistent checks
    let color;

    // Define colors based on crime types
    if (crimeType === "theft") {
        color = "orange";
    } else if (crimeType === "assault") {
        color = "red";
    } else if (crimeType === "vandalism") {
        color = "blue";
    } else if (crimeType === "fraud") {
        color = "purple";
    } else {
        color = "black"; // Default color for undefined crimes
    }

    // Add a new marker to the map for the reported crime
    const marker = L.marker([report.latitude, report.longitude]).addTo(map);
    marker.bindPopup(`
        <div style="text-transform: capitalize; font-size: 8px; color: ${color}">
            <div style="text-align: center; font-size: 10px">
            <b>AREA:  ${report.circleID} </b> <br><hr>
            </div>
            <b>Crime Type:</b> ${report.crimeType}<br>
            <b>Description:</b> ${report.description}<br>
            <b>Reported at:</b> ${report.street}<br>
            <b>Reported on:</b> ${formattedDate}
        </div>
    `).openPopup();
});

//CIRCLE OVERLAY 

// Circle definitions - cicle counting start from the top 
const circles = [
    { id: 1, lat: 14.361260074803814, lng: 121.05718016624452, radius: 100, color: 'green'}, //circle 1
    { id: 2, lat: 14.359810491668052, lng: 121.05781316757204, radius: 70, color:'green'}, //circle 2
    { id: 3, lat: 14.359368517975929, lng: 121.05887129902841, radius: 70, color: 'green'}, //circle 3
    { id: 4, lat: 14.358368694422813, lng: 121.05800628662111, radius: 70, color: 'green' }, //circle 4
    { id: 5, lat: 14.358134835918086, lng: 121.05912744998933, radius: 70, color: 'green' }, // circle 5
    { id: 6, lat: 14.35726371083779, lng: 121.0584729909897, radius: 70, color: 'green'}, //circle 6
    { id: 7, lat: 14.356084016287031, lng: 121.05936348438264, radius: 100, color: 'green'}, //circle 7
    { id: 8, lat: 14.354467772690725, lng: 121.0602378845215, radius: 100, color: 'green'}, // circle 8
    { id: 9, lat: 14.353574221433659, lng: 121.0618042945862, radius: 70, color: 'green'}, // circle 9 
    { id: 10, lat: 14.351988816915645, lng: 121.0623461008072, radius: 100, color: 'green'}, // circle 10
    { id: 11, lat: 14.349915528714972, lng: 121.06334924697877, radius: 100, color: 'green'}, // circle 11
  ];

// Create Leaflet circle objects
const leafletCircles = circles.map(circle => {
    return L.circle([circle.lat, circle.lng], {
      radius: circle.radius,
      color: circle.color,
    }).addTo(map);
});


  // Listen for the 'circle-data' event from the server
socketUser.on('circle-data', (data) => {
    console.log('Received circle data:', data); // Add this
      data.forEach((circleData, index) => {
        const count = circleData.count;
        let newColor = 'green';
        if (count >= 5 && count <= 10) newColor = 'yellow';
        else if (count > 10 && count <= 20) newColor = 'orange';
        else if (count > 20) newColor = 'red';

        console.log(`Circle ${index} new color: ${newColor}`);

        // Update circle color based on report count
        leafletCircles[index].setStyle({ color: newColor });
      });
});