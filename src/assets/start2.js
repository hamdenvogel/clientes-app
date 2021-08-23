console.log('start2.js file: Starting JQuery');
    (function($) {
        "use strict";

        // Add active state to sidbar nav links
        var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
            $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
                if (this.href === path) {
                    $(this).addClass("active");
                }
            });

        // Toggle the side navigation
        $("#sidebarToggle").on("click", function(e) {
            e.preventDefault();
            $("body").toggleClass("sb-sidenav-toggled");
            if ($("#layoutSidenav_nav").is(":visible")) {
              $("#layoutSidenav_nav").show();
            }
            else {
             $("#layoutSidenav_nav").hide();
            }
        });

        $(".nav-link").on('click', function(event){
          $("body").toggleClass("sb-sidenav-toggled");
        });

    })(jQuery);
