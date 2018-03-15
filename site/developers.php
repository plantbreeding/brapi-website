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
                $PageTitle = "Developer Resources";
                include("html/page-title-section.php");
            ?>
            <div class="main">
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
            devLinks.done(function(links){
              $(links).each(function(i, e) {
                var template = $('#link-template').html();
                Mustache.parse(template); // optional, speeds up future uses
                var rendered = Mustache.render(template, e);
                
                if($(e)[0]['type'] == 'doc'){
                    $('#links-grid-docs').append(rendered);
                }else if($(e)[0]['type'] == 'tool'){
                    $('#links-grid-tools').append(rendered);
                }else if($(e)[0]['type'] == 'lib'){
                    $('#links-grid-libs').append(rendered);
                }
              });
            });
        </script>
        
    </body>
</html>