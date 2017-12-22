var app = app || {};

(function(module) {
  let heroView = {};

  function appendHeroView() {

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
    console.log(heroData)
    heroData.sort((a,b) => a.name < b.name ? -1 : 1 );
    console.log(heroData)
    app.Hero.all = heroData.map(hero => new app.Hero(hero))
    appendHeroView();
  }

  module.heroView = heroView

  module.initFunctions = {initStatsPage: module.stats.initStatsPage, initIndexPage: ()=> $('.home-nav-item').click()};

})(app);

$(function() {

  $.get('/etags').then(etag => {
    app.etag = etag
    app.heroView.initIndexPage()
  });

  $('#hero-view-list').on('click', 'li', function() {
    //app.stats.initStatsPage(this);
    app.stats.initStatsPage($(this).attr('data-hero-index'));
    $('html').animate({ scrollTop: 0 }, 600);
  } )

  $('.home-nav-item').on('click', function() {
    app.heroView.resetURl('', '/', 'initIndexPage' )
    $('.container').hide()
    $('#hero-view').show()
    $('html').animate({scrollTop:0}, 600);
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

// /*********** History ***********/
// window.onpopstate = function (event){
//   console.log('URL:', document.location, 'State:', event.state, 'hash:', document.location.hash);
//   if (event.state){
//     let fn = event.state.callback;
//     app.initFunctions[fn](event.state.data)
//   }
// }






// heroView.initIndexPage = () => {
//   let heroData;
//   if (localStorage.heroes) {
//     console.log('inside if')
//     setAll(JSON.parse(localStorage.heroes))

//   } else {
//     $.get('/heroes')
//     // .then(data => )
//       .then(data => {
//         setAll(data)
//         localStorage.heroes = JSON.stringify(data)})
//       // .then(appendHeroView)
//       .catch(console.error)
//   }
// }
