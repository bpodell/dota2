'use strict';

// $('#icon').on('click', function () {
//   if ($(window).width() < 781) {
//     $('#home').toggleClass('is-visible');
//   }
// })

$('#icon, nav li').on('click', function () {
  if ($(window).width() < 781) {
    $('#nav-menu').toggleClass('is-visible');
  }
});

$('.home-nav-item').on('click', function() {
  $('.container').hide()
  $('#hero-view').show()
  $('html').animate({scrollTop:0}, 400);
  $('.fullscreen-bg').css('background', `url(../img/allHeroesEdited.jpg) center center / cover no-repeat`);
})

$('.about-nav-item').on('click', function () {
  $('.container').hide()
  $('#about-view').show()
  $('html').animate({ scrollTop: 0 }, 400);
  $('.fullscreen-bg').css('background', `url(../img/class.jpg) center center / cover no-repeat`);
})


$('.pros-nav-item').on('click', function() {
  $('.container').hide();
  $('html').animate({ scrollTop: 0 }, 400);
  initProPage();
  $('.fullscreen-bg').css('background', `url(../img/aegis.png) center center / cover no-repeat`);
})
