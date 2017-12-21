'use strict';

// var $video = $('.fullscreen-bg_video');
// var downloadingVideo = new Video();
// downloadingVmage.onload = function () {
//     image.src = this.src;
// };
// downloadingVideo.src = "video/ti7-opening-reel";

$('#icon, nav li').on('click', function () {
  if ($(window).width() < 781) {
    $('#nav-menu').toggleClass('is-visible');
  }
});

$('.home-nav-item').on('click', function() {
  $('.container').hide()
  $('#hero-view').show()
  $('html').animate({scrollTop:0}, 600);
  $('.fullscreen-bg').css('background', `url(../img/allHeroesEdited.jpg) center center / cover no-repeat`);
})


$('.pros-nav-item').on('click', function() {
  initProPage();
})
