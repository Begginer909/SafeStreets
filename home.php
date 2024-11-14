<?php
include('components/link.php');
?>

<body>

    <?php
    include('components/Navbar.php')
    ?>

    <div class="container-fluid px-4">
        <h2 class="my-3">Home Page</h2>

        <div class="row border border-dark border-2 py-3" style="background-color: #1f497d;">
            <div class="home col-12 ms-lg-5 col-lg-3 py-4">
                <h3 class="fs-lg-2 fs-3 text-center">Barangay Nueva <br>HOTLINES</h3>
                <div class="mt-4" style="background-color: #4a6c96;">
                    <div class="icon row py-3 ms-2">
                        <h3 class="fs-lg-2 fs-3">Telephone Number: </h2>
                            <div class="col-lg-12 d-flex align-items-center pb-2">
                                <i class="fs-lg-3 fs-4 fa-solid fa-phone"></i>
                                <p class="fs-lg-3 fs-4 ms-2 mb-0">09189071233</p>
                            </div>
                            <hr class="divider">
                            <h3 class="fs-lg-2 fs-3">Cellphone Number: </h2>
                                <div class="col-lg-12 d-flex align-items-center">
                                    <i class="fs-lg-3 fs-4 fa-solid fa-mobile"></i>
                                    <p class="fs-lg-3 fs-4 ms-2 mb-0">09189071233</p>
                                </div>
                    </div>
                </div>
            </div>
            <div class="home col-12 col-lg-8 position-lg-absolute end-0 me-3 py-3">
                <h3 class="fs-2 text-center">Barangay Nueva's Upcoming Events</h3>
                <div class="mt-4 mx-lg-3 py-5 px-4" style="background-color: #4a6c96;">
                    <div class="row">
                        <div class="col-4">
                            <div class="image-container" style="background-color: #fff;">
                                <img class="imageEvents" src="Logo.png" alt="Event 1">
                                <p><a href="Una.jpg" target="_blank">Breastfeeding and HIV Awareness</a></p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="image-container" style="background-color: #fff;">
                                <img class="imageEvents" src="Logo.png" alt="Event 1">
                                <p><a href="Una.jpg" target="_blank">Breastfeeding and HIV Awareness</a></p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="image-container" style="background-color: #fff;">
                                <img class="imageEvents" src="Logo.png" alt="Event 1">
                                <p><a href="Una.jpg" target="_blank">Breastfeeding and HIV Awareness</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="bootstrap/js/bootstrap.js"></script>
    <!--Directory ko ito kung saan nakalagay yung bootstrap ko. Papalitan nalang ng link ng bootstrap online-->
    <script src="script/script.js"></script>
    <script src="script/scriptHome.js"></script>
</body>