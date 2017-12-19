var app = app || {};

(function(module) {
  let heroView = {};
  function appendHeroView() {
    app.Hero.all.forEach(hero => $('#hero-view').append(hero.toHtml()))
  }

  heroView.initIndexPage = () => {
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
  }
  module.heroView = heroView
})(app);

$(function() {
  app.heroView.initIndexPage()
  $('#hero-view').on('click', 'li', function() {
    console.log($(this).attr('data-hero-id'));
    $.get(`/stats/${$(this).attr('data-hero-id')}`)
      .then(console.log)
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