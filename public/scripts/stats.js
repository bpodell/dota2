'use strict'

var app = app || {};

(function(module){

  let stats = {};
  stats.heroStats = {};

  stats.initStatsPage = (heroStats) => {
    stats.heroStats = heroStats;
    $('.container').hide();
    $('#stats-view').empty();
    $('#stats-view').show();
    $('html').animate({ scrollTop: 0 }, 600);
    $.get(`/stats/${heroStats.hero_id}`)
      .then(stats.parseBenchmarks)
      .then(()=> stats.toHtml() )
  }

  stats.parseBenchmarks = (benchMarks) => {
    stats.heroStats.gold_per_min = benchMarks.result.gold_per_min[4].value;
    stats.heroStats.hero_damage_per_min = (Math.round(benchMarks.result.hero_damage_per_min[4].value* 100)/100).toFixed(2);
    stats.heroStats.hero_healing_per_min = (Math.round(benchMarks.result.hero_healing_per_min[4].value* 100)/100).toFixed(2) || 0;
    stats.heroStats.kills_per_min = (Math.round(benchMarks.result.kills_per_min[4].value * 100)/100).toFixed(2);
    stats.heroStats.last_hits_per_min = (Math.round(benchMarks.result.last_hits_per_min[4].value * 100)/100).toFixed(2);
    stats.heroStats.tower_damage = benchMarks.result.tower_damage[4].value;
    stats.heroStats.xp_per_min = benchMarks.result.xp_per_min[4].value;
    stats.heroStats.primary_attr = stats.heroStats.primary_attr.toUpperCase();
    stats.heroStats.roles = stats.heroStats.roles.replace(/["{}]/g, '').replace(/,/g, ', ');
  }

  stats.toHtml = function() {
    var template = Handlebars.compile($('#stats-template').text());
    $('#stats-view').append(template(stats.heroStats));
    let hero_image_name = stats.heroStats.name.split(' ').join('').toLowerCase().replace(/'/g, '');
    $('.fullscreen-bg').css('background', `url(../img/wallpaper/${hero_image_name}.jpg) center center / cover no-repeat`);
  }

  module.stats = stats;

})(app)
