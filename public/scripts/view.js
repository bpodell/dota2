'use strict';

// var $video = $('.fullscreen-bg_video');
// var downloadingVideo = new Video();
// downloadingVmage.onload = function () {
//     image.src = this.src;
// };
// downloadingVideo.src = "video/ti7-opening-reel";

$('#icon').on('click', function () {
  $('#nav-menu').toggleClass('is-visible');
})

$('#home-nav-item').on('click', function() {
  $('.fullscreen-bg').css('background', `url(../img/allHeroesEdited.jpg) center center / cover no-repeat`);
})


