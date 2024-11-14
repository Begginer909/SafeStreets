<?php
include('components/link.php');
?>

<body>

    <?php
    include('components/Navbar.php');
    ?>


    <div class="container-fluid px-4">
        <h2 class="my-3">Create a Report</h2>
        <div class="row mb-5 py-5 border border-2 border-dark position-relative d-flex justify-content-center" style="background-color: #1f497d;">
            <div class="col-12 col-lg-5 px-5 py-5 report-container">
                <h1>CRIME DETAILS</h1>
                <form id="crime-report-form">
                    <label for="name">Witness Name:</label>
                    <input type="text" id="name" name="name" required>

                    <label for="contact">Contact Number:</label>
                    <input type="tel" id="contact" name="contact" required>

                    <label for="location">Crime Incident Location:</label>
                    <select id="location" name="location" required>
                        <option value="">Select Location</option>
                        <option value="Location1">Location 1</option>
                        <option value="Location2">Location 2</option>
                        <option value="Location3">Location 3</option>
                    </select>

                    <label>Date and Time:</label>
                    <div class="datetime">
                        <select name="month" required>
                            <option value="">Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                        <select name="day" required>
                            <option value="">Day</option>
                            <option value="01">1</option>
                            <option value="02">2</option>
                            <option value="03">3</option>
                            <option value="04">4</option>
                            <option value="05">5</option>
                            <option value="06">6</option>
                            <option value="07">7</option>
                            <option value="04">8</option>
                            <option value="04">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>
                    </div>
                    <div class="my-3"></div>
                    <div class="datetime">
                        <select name="year" id="year" required>
                            <!-- JavaScript will populate this -->
                        </select>
                        <input type="time" name="time" required>
                    </div>

                    <div class="mb-3">
                        <label for="crime-type">Type of Crime:</label>
                        <select id="crime-type" name="crime-type" required>
                            <option value="">Select a crime type</option>
                            <option value="burglary">Burglary</option>
                            <option value="assault">Assault</option>
                            <option value="theft">Theft</option>
                            <option value="vandalism">Vandalism</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="btn-container">
                        <button type="button" class="btn-submit btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Submit Report</button>
                        <button type="reset" class="btn-cancel">Cancel Report</button>
                    </div>

                    <!-- Modal -->
                    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Confirmation</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <p>Are you sure you want to submit this report?</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                    <button type="button" class="btn btn-primary">Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const yearSelect = document.getElementById('year');
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 10;
        const endYear = currentYear + 5;

        for (let year = startYear; year <= endYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        yearSelect.value = currentYear;

        /*  
        function showModal() {
            fetch('modal.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('modal-container').innerHTML = data;
                    document.getElementById('modal-container').style.display = 'flex';
                });
        }*/
    </script>

    <script src="bootstrap/js/bootstrap.js"></script>
    <!--Directory ko ito kung saan nakalagay yung bootstrap ko. Papalitan nalang ng link ng bootstrap online-->
    <script src="script/script.js"></script>
</body>