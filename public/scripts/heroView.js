var app = app || {};

(function(module) {
  let heroView = {};

  heroView.appendHeroView = () => {
    app.Hero.all.forEach((hero, i) => {
      hero.arrayIndex = i
      $('#hero-view-list').append(hero.toHtml())
    })
  }

  heroView.setURl = (data, url, callback) => {
    if (window.location.pathname === url) return
    history.pushState( {
      data: data,
      callback: callback
    }, null, url);
  }

  heroView.initIndexPage = () => {
    $('.container').hide();
    $('#hero-view').show();

    let localHeroes = localStorage.heroes ? JSON.parse(localStorage.heroes) : [];
    if (localStorage.etag === app.etag && localHeroes.length) return setAll(localHeroes);
    $.get('/heroes')
      .then(data => {
        setAll(data)
        localStorage.heroes = JSON.stringify(data)
        localStorage.etag = app.etag;
      })
      .catch(console.error);
  };

  function setAll (heroData) {
    heroData.sort((a,b) => a.name < b.name ? -1 : 1 );
    app.Hero.all = heroData.map(hero => new app.Hero(hero))
    heroView.appendHeroView();
  }

  module.heroView = heroView

})(app);

$(function() {
  app.heroView.setURl('', '/', 'homeNavItem' )
  $.get('/etags').then(etag => {
    app.etag = etag
    app.heroView.initIndexPage()
    $('#sort-form').on('change', function(e) {
      let eVal = $('#sort-menu').val()
      app.Hero.all.sort((a,b) => a[eVal] < b[eVal] ? -1 : 1 );
      if ($('#asc-menu').val() === 'desc') app.Hero.all.reverse();
      $('#hero-view-list').empty();
      app.heroView.appendHeroView();
    })
  });

  $('#hero-view-list').on('click', 'li', function() {
    let idx = $(this).attr('data-hero-index');
    let hero = app.Hero.all[idx];
    let statURL = `/heroes-stat/${hero.name.split(' ').join('-')}`;
    app.heroView.setURl(idx , statURL, 'initStatsPage');
    app.stats.initStatsPage(hero);
  } )

  /*********** History ***********/
  window.onpopstate = function (event){
    if ( !event.state ) return app.initFunctions['homeNavItem']();
    let fn = event.state.callback
    let fargs = (fn === 'initStatsPage') ? app.Hero.all[event.state.data] : event.state.data;
    app.initFunctions[fn](fargs);
  }
})
