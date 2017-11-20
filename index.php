<!DOCTYPE html>
<html lang="en-US" dir="ltr">

<?php
include("html/header.html");
?>
    <body data-spy="scroll" data-target=".onpage-navigation" data-offset="60">
        <main>
            <?php

                include("html/menu.html");
                include("html/home-section.html");
            ?>
            <div class="main">
                <?php
                    include("html/about-section.html");
                    include("html/usecases-section.html");
                    include("html/partners-section.html");
                    include("html/links-section.html");
                    include("html/ack-section.html");
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
        <?php
            include("html/scripts.html");
        ?>
    </body>
</html>