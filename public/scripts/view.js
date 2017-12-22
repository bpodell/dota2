'use strict';

$('#icon, nav li').on('click', function () {
  if ($(window).width() < 781) {
    $('#nav-menu').toggleClass('is-visible');
  }
});

$('.home-nav-item').on('click', function() {
  app.heroView.setURl('', '/', 'initIndexPage' )
  $('.container').hide()
  $('#hero-view').show()
  $('html').animate({scrollTop:0}, 600);
  $('.fullscreen-bg').css('background', `url(../img/allHeroesEdited.jpg) center center / cover no-repeat`);
})

$('.about-nav-item').on('click', function () {
  app.heroView.setURl('', '/about', '#about-view' )
  $('.container').hide()
  $('#about-me').show()
  $('html').animate({ scrollTop: 0 }, 600);
  $('.fullscreen-bg').css('background', `url(../img/class.jpg) center center / cover no-repeat`);
})


$('.pros-nav-item').on('click', function() {
  app.heroView.setURl('', '/pro-team-stats', '#pro-view' )
  $('.container').hide();
  $('html').animate({ scrollTop: 0 }, 600);
  initProPage();
  $('.fullscreen-bg').css('background', `url(../img/aegis.png) center center / cover no-repeat`);
})
