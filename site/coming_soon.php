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
            <nav class="navbar navbar-custom navbar-fixed-top navbar-transparent" role="navigation">
                <?php
                    include("html/menu.html");
                ?>
            </nav>
            <section class="home-section home-parallax home-fade home-full-height bg-dark bg-dark-30" id="home" data-background="assets/images/header.jpg">
                <div class="titan-caption">
                <div class="caption-content">
                    <div class="font-alt mb-30 titan-title-size-4">COMING SOON</div>
                    <div class="font-alt">Site under construction
                    </div>
                    <div class="font-alt mt-30"><a class="btn btn-border-w btn-round" href="/">Back to home page</a></div>
                </div>
                </div>
            </section>
            <div class="main">
                <?php
                    include("html/footer.html");
                ?>
            </div>
            <div class="scroll-up"><a href="#totop"><i class="mdi mdi-chevron-up"></i></a></div>
        </main>
    </body>
</html>