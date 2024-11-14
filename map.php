<?php
include('components/link.php');
?>

<body>

    <?php
    include('components/Navbar.php');
    ?>

    <div class="container-fluid">
        <h2 class="mt-5 mb-3 d-flex justify-content-center">Crime Statistics</h2>
        <div class="sizeCanvas col-12 mb-5">
            <canvas id="myChart"></canvas>
        </div>

        <h2 class="mt-5 mb-3 d-flex justify-content-center">Crime Density Map</h2>
        <div class="map col-12">
            <div id="map"></div>

            <input type="text" id="inputColor" placeholder="Please input the street and color" style="width: 300px">
            <button onclick="updateColors()">Confirm</button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>




    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        // Initialize the map
        var map = L.map('map').setView([14.358083677714449, 121.0583616614907], 19);

        // Add a tile layer (you can use different tile providers)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create circles with default colors
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


        var circleStreet2nd = L.circle([14.357803047123392, 121.05888201004971], {
            color: 'transparent',
            fillColor: 'red', // Default color
            fillOpacity: 0.5,
            radius: 30
        }).addTo(map);

        function updateColors() {
            var inputColor = document.getElementById("inputColor").value.toLowerCase();

            // Update the fill color of circles based on input
            if (inputColor === "4th blue") {
                circleStreet4th.setStyle({
                    fillColor: 'blue'
                });
            } else if (inputColor === "5th blue") {
                circleStreet5th.setStyle({
                    fillColor: 'blue'
                });
            } else if (inputColor === "2nd blue") {
                circleStreet2nd.setStyle({
                    fillColor: 'blue'
                });
            }
        }

        function test() {
            circleStreet2nd.on('click', function(e) {
                var color = circleStreet2nd.options.fillColor;
                console.log(`Circle color: ${color}`);
            });
        }
        const eventHandler = {
            maps: map,
            handleMapClick: function(e) {
                console.log('Map clicked at:', e.latlng)
            },
            handleCircleClick: test
        };

        L.DomEvent.on(map, 'click', eventHandler.handleMapClick);
        L.DomEvent.on(map, 'click', eventHandler.handleCircleClick);


        const eventHandlers = {
            handleClick: function(e) {
                console.log("Button clicked! This refers to:", this);
            },
            handleMouseOver: function(e) {
                console.log("Mouse over button! This refers to:", this);
            },
            handleOnMouseOver: function(e) {
                console.log("Location is: ", e.latlng);
            }
        };

        // Define a context object
        const contextObject = {
            contextName: 'Context Object',
        };

        // Custom `on` function to attach multiple event handlers
        function on(el, eventMap, context) {
            for (let [eventType, handler] of Object.entries(eventMap)) {
                el.addEventListener(eventType, handler.bind(context));
            }
        }

        // Use the custom `on` function to attach event handlers
        on(map, {
            click: eventHandlers.handleClick,
            mouseover: eventHandlers.handleMouseOver,
            onclick: eventHandlers.handleOnMouseOver,
        }, contextObject);
    </script>

    <script src="bootstrap/js/bootstrap.js"></script>
    <!--Directory ko ito kung saan nakalagay yung bootstrap ko. Papalitan nalang ng link ng bootstrap online-->
    <script src="script/script.js"></script>
</body>