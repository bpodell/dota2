var app = app || {};

(function(module) {
  let heroView = {};
  function appendHeroView() {
    app.Hero.all.forEach(hero => $('#hero-view-list').append(hero.toHtml()))
  }

  heroView.initIndexPage = () => {
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
    console.log($(this).attr('data-hero-id'));
    $.get(`/stats/${$(this).attr('data-hero-id')}`)
      .then(console.log)
  } )
})