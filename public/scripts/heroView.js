var app = app || {};

(function(module) {
  let heroView = {};
  heroView.appendHeroView = () => {

    app.Hero.all.forEach((hero, i) => {
      hero.arrayIndex = i
      $('#hero-view-list').append(hero.toHtml())
    })


  }

  heroView.setURl = (view, url) => {
    history.pushState( {
      view: view,
    }, null, url);
  }

  heroView.initIndexPage = () => {
    heroView.setURl('home', '/')
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
    heroView.appendHeroView();
  }


  module.heroView = heroView
})(app);

$(function() {

  app.heroView.initIndexPage()
 

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
    app.stats.initStatsPage(this);
    $('html').animate({ scrollTop: 0 }, 600);
  } )
})

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
