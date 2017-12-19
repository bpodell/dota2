'use strict'
var app = app || {};

(function(module) {
  

  function Hero(heroData) {
    Object.keys(heroData).forEach(key => this[key] = heroData[key]);
    // this.name = heroData.name;
    // this.image_url = heroData.image_url;
    // this.primary_attr = heroData.primary_attr;
    // this.roles = heroData.roles;
    // this.move_speed = heroData.move_speed;
    // this.turn_rate = heroData.turn_rate;

  }
  Hero.all = [];
  Hero.prototype.toHtml = function() {
    var template = Handlebars.compile($('#hero-template').text());
    console.log(template(this))
    return template(this);
  }
  
  module.Hero = Hero
})(app)