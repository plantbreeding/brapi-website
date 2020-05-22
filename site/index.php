<!DOCTYPE html>
<html lang="en-US" dir="ltr">

<?php
    include("html/header.html");
?>
    <body data-spy="scroll" data-target=".onpage-navigation" data-offset="60">
        <main>
            <div class="page-loader">
                <div class="loader">Loading...</div>
            </div>
            <nav class="navbar navbar-custom navbar-fixed-top navbar-transparent" role="navigation">
                <?php
                    include("html/menu.html");
                ?>
            </nav>
            <?php
                include("html/home-section.html");
            ?>
            <div class="main">
                <?php
                    include("html/about-section.html");
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
    </body>
</html>