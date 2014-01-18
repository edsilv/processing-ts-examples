
$(function(){
    var $window = $(window), $nav = $('#nav'), $main = $('#main');

    $(window).on('resize', function(e){
        resize();
    });

    // resize main container to fit window
    function resize(){
        $main.width($window.width());
        $main.height($window.height() - $nav.height());
    }

    resize();
});