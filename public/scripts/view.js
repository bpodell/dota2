'use strict';

$('#icon, nav li').on('click', function () {
  if ($(window).width() < 781) {
    $('#nav-menu').toggleClass('is-visible');
  }
});
