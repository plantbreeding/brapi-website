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
        <script>
            
            $( document ).ready(function() {
                $.getJSON("json/news.json?nocache=" + Date.now(), function(news){
                    $.urlParam = function(name){
                        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                        if(results){
                            return results[1] || 0;
                        }else{
                            return undefined;
                        }
                    }
                    
                    if($.urlParam('id')){
                        var news_post_template = $('#news-post-template').html();
                        Mustache.parse(news_post_template); // optional, speeds up future uses

                        var story = $(news)[0][$.urlParam('id')]
                        var rendered = Mustache.render(news_post_template, story);
                        $('#brapi-posts').append(rendered);
                    }else{
                        var news_list_template = $('#news-list-template').html();
                        Mustache.parse(news_list_template); // optional, speeds up future uses

                        for (var key in $(news)[0]) {
                            var story = $(news)[0][key];
                            story.id = key;
                            var rendered = Mustache.render(news_list_template, story);
                            $('#brapi-posts').append(rendered);
                        }
                    }
                });
            });
        </script>
    </body>
</html>