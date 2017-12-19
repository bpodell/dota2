var app = app || {};

(function(module) {
  let heroView = {};
  function appendHeroView() {
    app.Hero.all.forEach(hero => $('#hero-view').append(hero.toHtml()))
  }

  heroView.initIndexPage = () => {
    history.pushState( {
      view: 'heroes-view'
    }, null, '/heroes');
    $.get('/heroes')
      .then(data => app.Hero.all = data.map(hero => new app.Hero(hero)))
      .then(appendHeroView)
      .catch(console.error)

    //
  }
  module.heroView = heroView
})(app);

$(function() {
  app.heroView.initIndexPage()
  $('#hero-view').on('click', 'li', function() {
    history.pushState( {
      view: 'stats-view'
    }, null, `/hero-stats/${$(this).find('h2').text()}`);
    console.log($(this).attr('data-hero-id'));
    $.get(`/stats/${$(this).attr('data-hero-id')}`)
      .then(console.log)
  } )
})
