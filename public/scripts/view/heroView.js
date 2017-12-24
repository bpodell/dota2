'use strict';

var app = app || {};

(function(module) {
  let heroView = {};

  heroView.appendHeroView = () => {
    app.Hero.all.forEach((hero, i) => {
      hero.arrayIndex = i;
      $('#hero-view-list').append(hero.toHtml());
    })
  }

  //helper function to set pushState
  heroView.setURl = (data, url, callback) => {
    if (window.location.pathname === url) return;
    history.pushState( {
      data: data,
      callback: callback
    }, null, url);
  }

  heroView.initIndexPage = () => {
    $('.container').hide();
    $('#hero-view').show();

    //check local storage for heros array
    let localHeroes = localStorage.heroes ? JSON.parse(localStorage.heroes) : [];
    //compare local storage etag to dtatbase etag and check length of heors array
    //if the etag is no mising and matches the database etag, and the hero array is not empty,
    //then load from local storage, otherwise fetch the data from the database
    if (localStorage.etag === app.etag && localHeroes.length) return heroView.setAll(localHeroes);
    $.get('/heroes')
      .then(data => {
        heroView.setAll(data);
        localStorage.heroes = JSON.stringify(data);
        localStorage.etag = app.etag;
      })
      .catch(console.error);
  };

  heroView.setAll = (heroData) => {
    heroData.sort((a,b) => a.name < b.name ? -1 : 1 );
    app.Hero.all = heroData.map(hero => new app.Hero(hero))
    heroView.appendHeroView();
  }

  module.heroView = heroView

  ///*****  event handlers ********///

  /************** filter change event ********************/
  $('#sort-form').on('change', function() {
    let eVal = $('#sort-menu').val()
    app.Hero.all.sort((a,b) => a[eVal] < b[eVal] ? -1 : 1 );
    if ($('#asc-menu').val() === 'desc') app.Hero.all.reverse();
    $('#hero-view-list').empty();
    app.heroView.appendHeroView();
  })

  /************** hero tile click event ********************/
  $('#hero-view-list').on('click', 'li', function() {
    let idx = $(this).attr('data-hero-index');
    let hero = app.Hero.all[idx];
    let statURL = `/heroes-stat/${hero.name.split(' ').join('-')}`;
    app.heroView.setURl(idx , statURL, 'initStatsPage');
    app.stats.initStatsPage(hero);
  } )

  /************** custon select click event ********************/
  $('.custom-select').on('click', 'li, input', function() {
    if ($(this).attr('data-value')) {
      $(this).parent().siblings('input[type="text"]').val($(this).text())
      $(this).parent().siblings('input[type="hidden"]').val($(this).attr('data-value')).change();
      $(this).closest('form').change();
    }
    $(this).closest('.custom-select').toggleClass('z-index-nine');
    $(this).closest('.custom-select').find('.custom-select-menu').slideToggle()

  })

  /*********** History popstate event  ***********/
  window.onpopstate = function (event){
    if ( !event.state ) return app.initFunctions['homeNavItem']();
    let fn = event.state.callback
    let fargs = (fn === 'initStatsPage') ? app.Hero.all[event.state.data] : event.state.data;
    app.initFunctions[fn](fargs);
  }

})(app);


//on page load
$(function() {

  //set initial pushState
  app.heroView.setURl('', '/', 'homeNavItem' )

  //fetch  etag from data basse then intit index page
  $.get('/etags').then(etag => {
    app.etag = etag
    app.heroView.initIndexPage()
  });

})
