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
                $PageTitle = "Partners";
                include("html/page-title-section.php");
            ?>
            <div class="main">
                <?php
                    include("html/partners-section.html");
                    include("html/ack-section.html");
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
        
        <script>
            $( document ).ready(function() {
                $.getJSON("json/partners.json?nocache=" + Date.now(), function(partners){
                    // Sort them by name
                    partners.sort(function(a, b) {
                        return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
                    });
            
                    var template = $('#partner-template').html();
                    Mustache.parse(template); // optional, speeds up future uses
                    $(partners).each(function(index, element) {
                        var rendered = Mustache.render(template, element);
                        $('#works-grid').append(rendered);
                    });
                });
            });
        </script>
    </body>
</html>