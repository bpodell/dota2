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
    history.pushState( {
      data: data,
      callback: callback
    }, null, url);
  }

  heroView.resetURl = (data, url, callback) => {
    history.replaceState( {
      data: data,
      callback: callback
    }, null, url);
  }

  heroView.initIndexPage = () => {
    heroView.setURl('', '/', 'initIndexPage' )
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

  module.initFunctions = {initStatsPage: module.stats.initStatsPage, initIndexPage: ()=> $('.home-nav-item').click()};

})(app);

$(function() {
  $('.container').hide();
  $.get('/etags').then(etag => {
    app.etag = etag
    app.heroView.initIndexPage();
    $('#sort-form').on('change', function(e) {
      let eVal = $('#sort-menu').val();
      app.Hero.all.sort((a,b) => a[eVal] < b[eVal] ? -1 : 1 );
      if ($('#asc-menu').val() === 'desc') app.Hero.all.reverse();
      $('#hero-view-list').empty();
      app.heroView.appendHeroView();
    })
  });


  $('#hero-view-list').on('click', 'li', function() {
    //app.stats.initStatsPage(this);
    app.stats.initStatsPage($(this).attr('data-hero-index'));
    $('html').animate({ scrollTop: 0 }, 400);
  } )

  $('.home-nav-item').on('click', function() {
    app.heroView.resetURl('', '/', 'initIndexPage' )
    $('.container').hide()
    $('#hero-view').show()
    $('html').animate({scrollTop:0}, 400);
    $('.fullscreen-bg').css('background', `url(../img/allHeroesEdited.jpg) center center / cover no-repeat`);
  })

  /*********** History ***********/
  window.onpopstate = function (event){
    console.log('URL:', document.location, 'State:', event.state);
    if (event.state){
      let fn = event.state.callback;
      app.initFunctions[fn](event.state.data)
    }
  }

})

