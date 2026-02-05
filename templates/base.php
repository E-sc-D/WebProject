<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Static Navigation - SB Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="style.css" rel="stylesheet" />
        <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
    </head>
    <body>
        <!-- TOP NAVBAR -->
         <!-- <header> -->
            <nav class="sb-topnav navbar navbar-expand navbar-dark">
                    <!-- Sidebar Toggle-->
                    <button
                        class="btn btn-link btn-sm order-lg-0 me-4 me-lg-0"
                        id="sidebarToggle"
                        type="button"
                        aria-label="Apri o chiudi il menu laterale">
                        <i class="fas fa-bars" aria-hidden="true"></i>
                    </button>
                    <h1>SPOTTED</h1>
                    <a class="nav-link">
                        <i class="fas fa-user fa-fw"></i>
                    </a>

                </nav>   
        <!--  </header> -->
        
       
        

        <div id="layoutSidenav">
            <!-- SIDENAV SINISTRA -->
        <div id="layoutSidenav_nav">
            <nav
                class="sb-sidenav accordion sb-sidenav-dark"
                id="sidenavAccordion"
                aria-label="Menu laterale principale">
                <div class="sb-sidenav-menu">
                    <div class="nav">
                        <a class="nav-link" href="#!">
                            <div class="sb-nav-link-icon" aria-hidden="true">
                                <i class="fas fa-tachometer-alt"></i>
                            </div>
                            <span>Dashboard</span>
                        </a>
                        <a class="nav-link" href="#!">
                            <div class="sb-nav-link-icon" aria-hidden="true">
                                <i class="fas fa-cog"></i>
                            </div>
                            <span>Settings</span>
                        </a>
                        <a class="nav-link" href="#!">
                            <div class="sb-nav-link-icon" aria-hidden="true">
                                <i class="fas fa-list"></i>
                            </div>
                            <span>Feeds</span>
                        </a>
                        <!-- Logout: se fa un'azione -->
                         <a class="nav-link" href="#!">
                            <div class="sb-nav-link-icon" aria-hidden="true">
                                <i class="fa-solid fa-plus"></i>
                            </div>
                            <span>Aggiungi post</span>
                        </a>
                        <a
                            class="nav-link btn btn-link text-start"
                            href="#!">
                            <div class="sb-nav-link-icon" aria-hidden="true">
                                <i class="fas fa-sign-out-alt"></i>
                            </div>
                            <span>Logout</span>
                        </a>
                        
                    </div>
                </div>
                <!-- Footer della sidenav -->
                <div class="sb-sidenav-footer">
                    <div class="small">Logged in as:</div>
                    <span>Admin</span>
                </div>
            </nav>
        </div>


            <!-- CONTENUTO PRINCIPALE -->
            <div id="layoutSidenav_content">
                <main>
                    <button></button>
                </main>

                
            </div>
            
        </div>
        <footer class="mt-auto py-3 ">
            <div class="container-fluid px-4">
                <div class="row align-items-center gy-3">

                    <!-- UNIVERSITÀ -->
                    <div class="col-md-4 small">
                        <strong>Università di Bologna</strong><br>
                        Corso di ingegneria e scienze informatiche<br>
                        A.A. 2025/2026
                    </div>

                    <!-- PARTECIPANTI -->
                    <div class="col-md-4 small text-md-center">
                        <div>
                            <strong>Adis Dema</strong>
                            adis.dema@studio.unibo.it
                        </div>
                        <div>
                            <strong>Edoardo</strong>
                            Edoardo@studio.unibo.it
        
                        </div>
                    </div>
                    <div class="col-md-4 text-md-end">
                        <span class="badge bg-secondary me-1">
                            <i class="fa-brands fa-html5 me-1"></i>HTML5
                        </span>

                        <span class="badge bg-secondary me-1">
                            <i class="fa-brands fa-css3-alt me-1"></i>CSS3
                        </span>

                        <span class="badge bg-secondary me-1">
                            <i class="fa-brands fa-js me-1"></i>JS ES6
                        </span>

                        <a href="https://getbootstrap.com/"
                        target="_blank"
                        rel="noopener"
                        class="badge me-1 bootstrap text-decoration-none">
                            <i class="fa-brands fa-bootstrap me-1"></i>Bootstrap 5.3
                        </a>

                        <a href="https://fontawesome.com/"
                        target="_blank"
                        rel="noopener"
                        class="badge fontawesome text-decoration-none">
                            <i class="fa-solid fa-icons me-1"></i>Font Awesome 6.3
                        </a>
                    </div>

                </div>

                <hr class="my-3 border-secondary">

                <!-- BOTTOM -->
                <div class="d-flex flex-column flex-md-row justify-content-between small">
                    <div>© 2026 Università degli Studi di Esempio</div>
                    <div>
                        <a href="#"  text-decoration-none me-3">Privacy</a>
                        <a href="#"  text-decoration-none me-3">Cookie</a>
                        <a href="#"  text-decoration-none">Accessibilità</a>
                    </div>
                </div>
            </div>
        </footer>



        <!-- JS -->
        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            crossorigin="anonymous"
        ></script>
        <script src="script.js"></script>
        <script src="../assets/js/index.js"></script>
    </body>

</html>

