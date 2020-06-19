$(document).ready(function(){
        $(".chargement").fadeOut(0, function(){
          $('#contenu *').fadeIn(300);
          $('.navbarre').fadeIn(300);
        });
    });

//---------------------autoplay

function autoplay(x) {
setTimeout(function(){
	var iframe = $(x)[0];
 	var player = $f(iframe);
  	player.api('play'); }, 1000);
}

//---------------------filtre

var $bouttons = $('.selection').click(function() {
  if (this.id == 'tous') {
    $('#contenu > ul > li > div').hide().fadeIn(450);
  } else {
    var $el = $('.' + this.id).hide().fadeIn(450);
    $('#contenu > ul > li > div').not($el).hide();
  }
})
//---------------------Lock
    $('.lock').click(function(event){
      event.preventDefault();
    });
//---------------------navbarre
            $(document).ready(function(){
    $('.navbarre').makeNavbar();
    $('#line').hoverline({'display' : 'none'});
});
   

