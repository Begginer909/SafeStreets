<!DOCTYPE html>
<html lang="en">

<body>

    <nav class="navbar navbar-expand-md" style="background-color: #1f497d; height: 100%">
        <div class="container-fluid">
            <button class="navbar-toggler bg-light border-light" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="row mx-auto">
                <a class="image" href="#">
                    <img src="./Logo.png" class="img-fluid" width="150px" height="60">
                </a>
            </div>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="items navbar-nav fs-3">
                    <li class="border-responsive nav-item active">
                        <a class="nav-link text-light" name="Home" aria-current="true" href="home.php">Home</a>
                    </li>
                    <li class="border-responsive nav-item">
                        <a class="nav-link text-light" name="mapView" href="map.php">Map View</a>
                    </li>
                    <li class="border-responsive nav-item">
                        <a class="nav-link text-light" name="createReport" href="createReport.php">Create Report</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Get all the nav items
            const navItems = document.querySelectorAll('.nav-item');

            // Loop through all the items and add the click event listener
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Remove the 'active' class from all items
                    navItems.forEach(i => i.classList.remove('active'));

                    // Add the 'active' class to the clicked item
                    this.classList.add('active');
                });
            });
        });
    </script>

</body>

</html>