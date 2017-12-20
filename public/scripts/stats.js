'use strict'

var app = app || {};

(function(module){

  let stats = {};

  let heroStats;

  stats.initStatsPage = (heroItem) => {
    let idx = $(heroItem).attr('data-hero-index')
    console.log('idx', idx)
    console.log(app.Hero.all[idx])
    heroStats = app.Hero.all[idx];
    $.get(`/stats/${$(heroItem).attr('data-hero-id')}`)
      .then(stats.parseBenchmarks)
      .then(()=> stats.toHtml() )
  }

  stats.parseBenchmarks = (benchMarks) => {
    console.log('benchMarks', benchMarks);
    heroStats.gold_per_min = benchMarks.result.gold_per_min[4].value;
    heroStats.hero_damage_per_min = (Math.round(benchMarks.result.hero_damage_per_min[4].value* 100)/100).toFixed(2);
    heroStats.hero_healing_per_min = (Math.round(benchMarks.result.hero_healing_per_min[4].value* 100)/100).toFixed(2) || 0;
    heroStats.kills_per_min = (Math.round(benchMarks.result.kills_per_min[4].value * 100)/100).toFixed(2);
    heroStats.last_hits_per_min = (Math.round(benchMarks.result.last_hits_per_min[4].value * 100)/100).toFixed(2);
    heroStats.tower_damage = benchMarks.result.tower_damage[4].value;
    heroStats.xp_per_min = benchMarks.result.xp_per_min[4].value;
  }

  stats.toHtml = function() {
    var template = Handlebars.compile($('#stats-template').text());
    $('#stats-view').append(template(heroStats));
    let x = heroStats.name.split(' ').join('').toLowerCase().replace(/'/g, '');
    console.log(`/img/wallpaper/${x}.jpg`)
    let statURL = `/heroes-stat/${heroStats.name.split(' ').join('-')}`;
    app.heroView.setURl('stats-view', statURL);
    $('.fullscreen-bg').css('background', `url(../img/wallpaper/${x}.jpg) center center / cover no-repeat`);
    console.log($('.fullscreen-bg').css('background'));
  }



  module.stats = stats;

})(app)
