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
            <nav class="navbar navbar-custom navbar-fixed-top" role="navigation">
                <?php
                    include("html/menu.html");
                ?>
            </nav>
            <?php
                $PageTitle = "BrAPP Showcase";
                include("html/page-title-section.php");
            ?>
            <div class="main">
                <?php
                    include("html/brapps-section.html");
                    /* include("html/brapps-dev-section.html"); */
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
        <script>
            function toggleVisible(id) {
                var x = document.getElementById(id);
                if (x.style.display === "block") {
                    x.style.display = "none";
                } else {
                    x.style.display = "block";
                }
            }
            
            $( document ).ready(function() {
                
                var brapp_template = $('#brapp-template').html();
                Mustache.parse(brapp_template); // optional, speeds up future uses
                
                var brapp_dev_template = $('#brapp-dev-template').html();
                Mustache.parse(brapp_dev_template); // optional, speeds up future uses
                
                // Load BrAPPs section template            
                var brappLinks = $.getJSON("json/app-links.json?nocache=" + Date.now());
                brappLinks.done(function(links){
                    $(links).each(function(i, e) {
                        if($(e)[0]['published']){
                            var rendered = Mustache.render(brapp_template, e);
                            $('#brapp-grid').append(rendered);
                        } else {
                            var rendered = Mustache.render(brapp_dev_template, e);
                            $('#brapp-dev-grid').append(rendered);
                        }
                    });
                });
            });
        </script>

    </body>
</html>
