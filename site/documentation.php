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
                $PageTitle = "Documentation";
                include("html/page-title-section.php");
            ?>
            <div class="main">

                <section class="module-small">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="row multi-columns-row post-columns" id="links-grid-docs">
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <?php
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
                }
              });
            });
        </script>

        <script id="link-template" type="x-tmpl-mustache">
            <div class="col-xs-12 col-md-6">
                <a href="{{ url }}" target="_blank">
                    <div class="post brapi-post">
                        <div class="post-thumbnail brapi-post-thumbnail col-xs-12">
                            <img src="{{ image }}" alt="{{ title }}" class="brapi-post-thumbnail-img" />
                        </div>
                        <div class="post-header font-alt col-xs-12">
                            <h2 class="post-title">{{ title }}</h2>
                        </div>
                        <div class="post-entry col-xs-12" style="padding-left: 15px; padding-right: 15px;">
                            <p>{{{ description }}}</p>
                        </div>
                    </div>
                </a>
            </div>
        </script>
        
    </body>
</html>