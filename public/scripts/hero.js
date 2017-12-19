'use strict'
var app = app || {};

(function(module) {
  Hero.all = [];

  function Hero(heroData) {
    this.name = heroData.name;
    this.image_url = heroData.image_url;
    this.primary_attr = heroData.primary_attr;
    this.roles = heroData.roles;
    this.move_speed = heroData.move_speed;
    this.turn_rate = heroData.turn_rate;

  }

  Hero.prototype.toHtml = function() {
    var template = Handlebars.compile($('#hero-template').text());
    return template(this);
  }
  
  module.Hero = Hero
})(app)