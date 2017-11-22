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
                $PageTitle = "Events";
                include("html/page-title-section.php");
            ?>
            <div class="main">
                <?php
                    include("html/events-section.html");
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
        <?php
            include("html/scripts.html");
        ?>
        <script>
            $.getJSON("json/events.json", function(event){
                $(event).each(function(i, e){
                    var template = $('#event-template').html();
                    Mustache.parse(template); // optional, speeds up future uses
                    var rendered = Mustache.render(template, e);
                    console.log($(e)[0]['image']);
                    if($(e)[0]['upcoming']){
                        $('#event-list').append(rendered);
                    }else{
                        $('#past-event-list').append(rendered);
                    }
                });
            });
        </script>
    </body>
</html>