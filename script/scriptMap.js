    // Initialize the map
    var map = L.map('map').setView([14.358083677714449, 121.0583616614907], 19);

    // Add a tile layer (you can use different tile providers)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    window.addEventListener('resize', function () {
        map.invalidateSize(); // Ensure the map resizes properly when the window is resized
    });

    // Create circles with default colors

    var circleStreet1st = L.circle([14.358118920538741, 121.05918645858766], {
        color: 'transparent',
        fillColor: 'red', // Default color
        fillOpacity: 0.5,
        radius: 30
    }).addTo(map);
    
    var circleStreet2nd = L.circle([14.357803047123392, 121.05888201004971], {
        color: 'transparent',
        fillColor: 'red', // Default color
        fillOpacity: 0.5,
        radius: 30
    }).addTo(map);

    var circleStreet3rd = L.circle([14.357783073290395, 121.05837643146516], {
        color: 'transparent',
        fillColor: 'red', // Default color
        fillOpacity: 0.5,
        radius: 30
    }).addTo(map);

    var circleStreet4th = L.circle([14.358169425879144, 121.05766965157575], {
        color: 'transparent',
        fillColor: 'red', // Default color
        fillOpacity: 0.5,
        radius: 30
    }).addTo(map);

    var circleStreet5th = L.circle([14.358366906376673, 121.05825437313592], {
        color: 'transparent',
        fillColor: 'red', // Default color
        fillOpacity: 0.5,
        radius: 30
    }).addTo(map);


    function updateColors() {
        var inputColor = document.getElementById("inputColor").value.toLowerCase();

        // Update the fill color of circles based on input
        if (inputColor === "4th blue") {
            circleStreet4th.setStyle({ fillColor: 'blue' });
        } else if (inputColor === "5th blue") {
            circleStreet5th.setStyle({ fillColor: 'blue' });
        } else if (inputColor === "2nd blue") {
            circleStreet2nd.setStyle({ fillColor: 'blue' });
        }
    }