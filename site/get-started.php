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
                $PageTitle = "Get Started";
                include("html/page-title-section.php");
            ?>
            <div class="main">
                <?php
                    include("html/get-started.html");
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>  
        <script>
            
            $( document ).ready(function() {
                $.getJSON("json/get-started-pages.json?nocache=" + Date.now(), function(pages){
                    $.urlParam = function(name){
                        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                        if(results){
                            return results[1] || 0;
                        }else{
                            return undefined;
                        }
                    }

                    var id = '0';
                    if($.urlParam('id')){
                        id = $.urlParam('id')
                    }
                    
                    var content_template = $('#gs-content-template').html();
                    var content = Mustache.render(content_template, $(pages)[0][id]);
                    $('#content').append(content);

                    var menu_template = $('#gs-menu-template').html();
                    Mustache.parse(menu_template); 

                    for (var key in $(pages)[0]) {
                        var page = $(pages)[0][key];
                        page.id = key;
                        var rendered = Mustache.render(menu_template, page);
                        $('#menu').append(rendered);
                    }
                    
                });
            });
        </script>      
    </body>
</html>