'use strict';

// var $video = $('.fullscreen-bg_video');
// var downloadingVideo = new Video();
// downloadingVmage.onload = function () {
//     image.src = this.src;
// };
// downloadingVideo.src = "video/ti7-opening-reel";

$('#icon').on('click', function () {
  $('#nav-menu').toggle();
})

// $(''). function() {

// }

$('.custom-select').on('click', 'li, input', function() {
  console.log('this', this);
  if ($(this).attr('data-value')) {
    $(this).parent().siblings('input[type="text"]').val($(this).text())
    $(this).parent().siblings('input[type="hidden"]').val($(this).attr('data-value')).change();
    $(this).closest('form').change();
  }
  $(this).closest('.custom-select').toggleClass('z-index-nine');
  $(this).closest('.custom-select').find('.custom-select-menu').slideToggle()

})
