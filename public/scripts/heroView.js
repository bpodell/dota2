var app = app || {};

(function(module) {
  let heroView = {};
  function appendHeroView() {
    app.Hero.all.forEach((hero, i) => {
      hero.arrayIndex = i
      $('#hero-view').append(hero.toHtml())
    })
    
  }

  heroView.initIndexPage = () => {
<<<<<<< HEAD
    history.pushState( {
      view: 'heroes-view'
    }, null, '/heroes');
    $.get('/heroes')
      .then(data => app.Hero.all = data.map(hero => new app.Hero(hero)))
      .then(appendHeroView)
      .catch(console.error)

    //
=======
    let heroData;
    if (localStorage.heroes) {
      console.log('inside if')
      setAll(JSON.parse(localStorage.heroes))

    } else {
      $.get('/heroes')
      // .then(data => )
        .then(data => {
          setAll(data)
          localStorage.heroes = JSON.stringify(data)})
        // .then(appendHeroView)
        .catch(console.error)
    }
  }
  
  function setAll (heroData) {
    app.Hero.all = heroData.map(hero => new app.Hero(hero))
    appendHeroView();
>>>>>>> c2cbc266dda0a37a07ab309dc4434af39e745e7b
  }
  module.heroView = heroView
})(app);

$(function() {
  app.heroView.initIndexPage()
  $('#hero-view').on('click', 'li', function() {
<<<<<<< HEAD
    history.pushState( {
      view: 'stats-view'
    }, null, `/hero-stats/${$(this).find('h2').text()}`);
    console.log($(this).attr('data-hero-id'));
    $.get(`/stats/${$(this).attr('data-hero-id')}`)
      .then(console.log)
  } )
})
=======
    app.stats.initStatsPage()
   
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
>>>>>>> c2cbc266dda0a37a07ab309dc4434af39e745e7b
