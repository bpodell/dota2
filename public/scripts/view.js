'use strict';

var app = app || {};

(function(module){

  let view = {}

  $('#icon, nav li').on('click', function () {
    if ($(window).width() < 781) {
      $('#nav-menu').toggleClass('is-visible');
    }
  });

  $('.home-nav-item').on('click', function() {
    app.heroView.setURl('', '/', 'homeNavItem' )
    view.home_nav_item()
  })

  $('.about-nav-item').on('click', function () {
    app.heroView.setURl('', '/about', 'aboutNavItem' )
    view.about_nav_item()
  })

  $('.pros-nav-item').on('click', function() {
    app.heroView.setURl('', '/pro-team-stats', 'prosNavItem' )
    view.pros_nav_item()
  })

  view.home_nav_item = () => {
    $('.container').hide()
    $('#hero-view').show()
    $('html').animate({scrollTop:0}, 600);
    $('.fullscreen-bg').css('background', `url(../img/allHeroesEdited.jpg) center center / cover no-repeat`);
  }

  view.about_nav_item = () => {
    $('.container').hide()
    $('#about-view').show()
    $('html').animate({ scrollTop: 0 }, 600);
    $('.fullscreen-bg').css('background', `url(../img/class.jpg) center center / cover no-repeat`);
  }

  view.pros_nav_item = () => {
    $('.container').hide();
    $('html').animate({ scrollTop: 0 }, 600);
    module.proView.initProPage();
    $('.fullscreen-bg').css('background', `url(../img/aegis.png) center center / cover no-repeat`);
  }

  module.view = view;
  module.initFunctions = {initStatsPage: module.stats.initStatsPage, homeNavItem: module.view.home_nav_item, aboutNavItem: module.view.about_nav_item, prosNavItem: module.view.pros_nav_item};

})(app);
