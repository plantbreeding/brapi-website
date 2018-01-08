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
                $PageTitle = "Application Showcase";
                include("html/page-title-section.php");
            ?>
            <div class="main">
                <div class="row">
                    <p>Welcome to the BrAPI Application Showcase, or BrAPPs for short. Each of these BrAPPs is an independent tool which can run on its own or can be easily integrated with a larger system. And of course, each BrAPP should be completely BrAPI driven and can be used with any BrAPI complient system. The goal is to keep the BrAPI community informed about what tools are available and encourage functionality sharing. If you have a BrAPP you would like to share with the community please reach out to <a href=\"mailto:brapicoordinatorselby@gmail.com\">a BrAPI Coordinator</a></p>
                </div>
                <?php
                    include("html/links-section.html");
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
        <?php
            include("html/scripts.html");
        ?>
        <script>
            $.getJSON("json/app-links.json", function(links){
              $(links).each(function(i, e) {
                var template = $('#link-template').html();
                Mustache.parse(template); // optional, speeds up future uses
                var rendered = Mustache.render(template, e);
                $('#links-grid').append(rendered);
              });
            });
        </script>
        
    </body>
</html>