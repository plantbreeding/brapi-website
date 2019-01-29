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
                $PageTitle = "News";
                include("html/page-title-section.php");
            ?>
            <div class="main">
                <?php
                    include("html/news-section.html");
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
        <?php
            include("html/scripts.html");
        ?>
        <script>
            $.getJSON("json/news.json", function(news){
                $.urlParam = function(name){
                    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                    if(results){
                        return results[1] || 0;
                    }else{
                        return undefined;
                    }
                }
                if($.urlParam('id')){
                    var story = $(news)[0][$.urlParam('id')]
                    var template = $('#news-post-template').html();
                    Mustache.parse(template); // optional, speeds up future uses
                    var rendered = Mustache.render(template, story);
                    $('#brapi-posts').append(rendered);
                }else{
                    for (var key in $(news)[0]) {
                        var story = $(news)[0][key];
                        story.id = key;
                        // console.log(story);
                        var template = $('#news-list-template').html();
                        Mustache.parse(template); // optional, speeds up future uses
                        var rendered = Mustache.render(template, story);
                        $('#brapi-posts').append(rendered);
                    }
                }
            });
        </script>
    </body>
</html>