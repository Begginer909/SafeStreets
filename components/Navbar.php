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
                <ul id="items" class="navbar-nav fs-3">
                    <button type="button" class="selectedItem border-responsive active">
                        <a class="nav-link text-light" name="Home" aria-current="true" href="home.php">Home</a>
                    </button>
                    <button type="button" class="selectedItem border-responsive">
                        <a class="nav-link text-light" name="mapView" href="map.php">Map View</a>
                    </button>
                    <button type="button" class="selectedItem border-responsive">
                        <a class="nav-link text-light" name="createReport" href="createReport.php">Create Report</a>
                    </button>
                </ul>
            </div>
        </div>
    </nav>

    <script>
        var header = document.getElementById("items");
        var btns = header.getElementsByClassName("selectedItem");
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function() {
                var current = document.getElementsByClassName("active");
                current[0].className = current[0].className.replace(" active", "");
                this.className += " active";
            });
        }
    </script>

</body>

</html>