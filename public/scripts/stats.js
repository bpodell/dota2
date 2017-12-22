'use strict'

var app = app || {};

(function(module){

  let stats = {};

  let heroStats;

  stats.initStatsPage = (idx) => {
    $('.container').hide()
    $('#stats-view').empty()
    $('#stats-view').show()
    heroStats = app.Hero.all[idx];
    $.get(`/stats/${heroStats.hero_id}`)
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
    heroStats.primary_attr = heroStats.primary_attr.toUpperCase();
    heroStats.roles = heroStats.roles.replace(/["{}]/g, '').replace(/,/g, ', ');
  }

  stats.toHtml = function() {
    var template = Handlebars.compile($('#stats-template').text());
    $('#stats-view').append(template(heroStats));
    let x = heroStats.name.split(' ').join('').toLowerCase().replace(/'/g, '');
    let statURL = `/heroes-stat/${heroStats.name.split(' ').join('-')}`;
    app.heroView.resetURl(heroStats.arrayIndex, statURL, 'initStatsPage');
    $('.fullscreen-bg').css('background', `url(../img/wallpaper/${x}.jpg) center center / cover no-repeat`);
  }

  module.stats = stats;
})(app)
